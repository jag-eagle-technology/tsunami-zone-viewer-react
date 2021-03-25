import React from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";
import APIPoint from "@arcgis/core/geometry/Point";
import { IFeatureLayerZoneMapping } from "./TsunamiFeatureLayer";
import Locate from "@arcgis/core/widgets/Locate";

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
}) => {
    const clickHandlerRef = React.useRef<IHandle>();
    const [layers, setLayers] = React.useState<APIFeatureLayer[]>([]);
    const layersRef = React.useRef<APIFeatureLayer[]>([]);
    const [layerZoneMappings, setLayerZoneMappings] = React.useState<
        (IFeatureLayerZoneMapping & { url: string })[]
    >([]);
    const [locate, setLocate] = React.useState<Locate>();
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
        clickHandlerRef.current = mapView.on("click", (event) => {
            var point = mapView.toMap({
                x: event.x,
                y: event.y,
            });
            queryLayers(point, layers);
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
    React.useEffect(() => {
        if (mapView && locate) {
            initTsunamiLocateHandler();
        }
    }, [mapView, locate]);
    const onLocate: __esri.LocateLocateEventHandler = (event) => {
        const locatePoint = new APIPoint({
            longitude: event.position.coords.longitude,
            latitude: event.position.coords.latitude,
        });
        queryLayers(locatePoint, layersRef.current);
    };
    const queryLayers = async (
        point: __esri.Point,
        layers: APIFeatureLayer[]
    ) => {
        setQuerying(true);
        setZoneTitle("Getting info for this location...");
        setZoneMessage(undefined);
        setZoneMessageTemplate(undefined);
        setZoneColor('rgb(71, 165, 237)');
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
                const layerZoneMapping = layerZoneMappings.find(
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
                    onLocate: onLocate,
                    setLocate: setLocate,
                });
            })}
        </>
    );
};

export default TsunamiQueryHandler;
