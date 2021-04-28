import React from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";
import APIPoint from "@arcgis/core/geometry/Point";
import { IFeatureLayerZoneMapping } from "./TsunamiFeatureLayer";
import Locate from "@arcgis/core/widgets/Locate";
import Search from "@arcgis/core/widgets/Search";
import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

interface ITsunamiQueryHandler {
    map?: APIMap;
    mapView?: APIMapView;
    children?: React.ReactNode;
    setZoneTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    setZoneMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
    setZoneMessageTemplate: React.Dispatch<
        React.SetStateAction<React.ReactElement | undefined>
    >;
    setZoneColor: React.Dispatch<React.SetStateAction<string>>;
    setInZone: React.Dispatch<React.SetStateAction<boolean>>;
    setQuerying: React.Dispatch<React.SetStateAction<boolean>>;
    setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const TsunamiQueryHandler: React.FC<ITsunamiQueryHandler> = ({
    map,
    mapView,
    children,
    setZoneTitle,
    setZoneMessage,
    setZoneMessageTemplate,
    setZoneColor,
    setInZone,
    setQuerying,
    setAddress,
}) => {
    const clickHandlerRef = React.useRef<IHandle>();
    const [layers, setLayers] = React.useState<APIFeatureLayer[]>([]);
    const layersRef = React.useRef<APIFeatureLayer[]>([]);
    const [layerZoneMappings, setLayerZoneMappings] = React.useState<
        (IFeatureLayerZoneMapping & { url: string })[]
    >([]);
    const layerZoneMappingsRef = React.useRef<
        (IFeatureLayerZoneMapping & { url: string })[]
    >([]);
    React.useEffect(() => {
        layerZoneMappingsRef.current = layerZoneMappings;
    }, [layerZoneMappings]);
    const [locate, setLocate] = React.useState<Locate>();
    const [search, setSearch] = React.useState<Search>();
    const searchRef = React.useRef<Search>();
    const sourceRef = React.useRef<"search" | "click" | "locate">();
    const queryPointGraphicLayerRef = React.useRef<GraphicsLayer>();
    React.useEffect(() => {
        searchRef.current = search;
    }, [search]);
    const addLayer = (featureLayer: APIFeatureLayer) => {
        setLayers((layers) => {
            layersRef.current = [...layers, featureLayer];
            return [...layers, featureLayer];
        });
    };
    const addLayerZoneMapping = (
        layerZoneMapping: IFeatureLayerZoneMapping & { url: string }
    ) =>
        setLayerZoneMappings((layerZoneMappings) => [
            ...layerZoneMappings,
            layerZoneMapping,
        ]);

    const initTsunamiQueryHandler = () => {
        if (!mapView) {
            throw new Error("no mapView set for tsunamiQueryHandler");
        }
        mapView.when(() => {
            clickHandlerRef.current = mapView.on("click", (event) => {
                var point = mapView.toMap({
                    x: event.x,
                    y: event.y,
                });
                queryLayers(point, layers, "click");
            });
            queryPointGraphicLayerRef.current = new GraphicsLayer();
            map?.add(queryPointGraphicLayerRef.current);
        });
    };
    const initTsunamiLocateHandler = () => {
        if (!mapView || !locate) {
            throw new Error("no mapView/Locate set for tsunamiLocateHandler");
        }
        mapView.when(() => {
            locate.viewModel.locate();
        });
    };
    const onLocate: __esri.LocateLocateEventHandler = (event) => {
        const locatePoint = new APIPoint({
            longitude: event.position.coords.longitude,
            latitude: event.position.coords.latitude,
        });
        queryLayers(locatePoint, layersRef.current, "locate");
    };
    const onSearchResults: __esri.SearchSelectResultEventHandler = (event) => {
        console.log(event);
        // attributes include Address, LongLabel, Match_addr
        setAddress(event.result.feature.attributes.LongLabel);
        if (!sourceRef.current) {
            sourceRef.current = "search";
        }
        if (sourceRef.current == "search") {
            const resultGeom = new Point(event.result.feature.geometry);
            queryLayers(resultGeom, layersRef.current, "search");
        }
    };
    const queryLayers = async (
        point: __esri.Point,
        layers: APIFeatureLayer[],
        source: "search" | "click" | "locate"
    ) => {
        // add in graphic to show queried location on map
        setQuerying(true);
        sourceRef.current = source;
        const queryPointSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 2,
            },
        };
        queryPointGraphicLayerRef.current?.removeAll();
        queryPointGraphicLayerRef.current?.add(
            new Graphic({
                geometry: point,
                symbol: queryPointSymbol,
            })
        );
        setZoneTitle("Getting info for this location...");
        if (source != "search") {
            searchRef.current?.search(point).then(() => {
                sourceRef.current = undefined;
            });
        }
        setZoneMessage(undefined);
        setZoneMessageTemplate(undefined);
        setZoneColor("rgb(71, 165, 237)");
        setInZone(false);
        const query: __esri.QueryProperties = {
            spatialRelationship: "intersects",
            geometry: point,
            outFields: ["*"],
            returnGeometry: false,
        };
        const handleResult = (result: __esri.FeatureSet, index: number) => {
            if (result.features.length > 0) {
                console.log(result.features[0].attributes);
                const layerZoneMapping = layerZoneMappingsRef.current.find(
                    (layerZoneMapping) =>
                        layerZoneMapping.url ==
                        `${layers[index].url}/${layers[index].layerId}`
                );
                if (layerZoneMapping) {
                    const alertLevelInfo = layerZoneMapping.zoneDetails.find(
                        (zone) =>
                            zone.zoneFieldValue ==
                            result.features[0].attributes[
                                layerZoneMapping.zoneField
                            ]
                    );
                    if (alertLevelInfo) {
                        setInZone(true);
                        setQuerying(false);
                        setZoneTitle(alertLevelInfo.messageTitle);
                        alertLevelInfo.messageBody &&
                            setZoneMessage(alertLevelInfo.messageBody);
                        alertLevelInfo.messageBodyTemplate &&
                            setZoneMessageTemplate(
                                React.createElement(
                                    alertLevelInfo.messageBodyTemplate,
                                    {
                                        attributes:
                                            result.features[0].attributes,
                                    }
                                )
                            );
                        setZoneColor(alertLevelInfo.zoneAlertColor);
                        console.log(
                            `%c${alertLevelInfo.messageTitle} - ${alertLevelInfo.messageBody}`,
                            `background-color: ${alertLevelInfo.zoneAlertColor}; color: black`
                        );
                    }
                }
            }
        };
        const results = await Promise.all(
            layers.map((layer, index) =>
                layer.queryFeatures(query).then((result) => {
                    handleResult(result, index);
                    return result;
                })
            )
        );
        if (!results.some((result) => result.features.length > 0)) {
            console.log("%coutside zone :)", "color: grey");
            setZoneTitle("Outside Tsunami Zone");
            setZoneMessage("Handy Message for if outside zone");
            setZoneColor("rgb(101, 240, 98)");
            setQuerying(false);
        }
    };
    React.useEffect(() => {
        if (mapView && locate) {
            initTsunamiLocateHandler();
        }
    }, [mapView, locate]);
    React.useEffect(() => {
        if (mapView) {
            initTsunamiQueryHandler();
        }
        return () => {
            clickHandlerRef.current?.remove();
        };
    }, [mapView, layers]);
    return (
        <>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    mapView,
                    map,
                    setLayer: addLayer,
                    setWarningTemplate: addLayerZoneMapping,
                    // onLocate: onLocate,
                    onLocate: (event: __esri.LocateLocateEvent) =>
                        onLocate(event),
                    onSelectResult: (event: __esri.SearchSelectResultEvent) =>
                        onSearchResults(event),
                    setLocate: setLocate,
                    setSearch: setSearch,
                });
            })}
        </>
    );
};

export default TsunamiQueryHandler;
