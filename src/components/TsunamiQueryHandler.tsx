import React from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";
import APIPoint from "@arcgis/core/geometry/Point";
import { IFeatureLayerZoneMapping } from "./TsunamiFeatureLayer";
import Locate from "@arcgis/core/widgets/Locate";
import { whenTrueOnce } from "@arcgis/core/core/watchUtils";

interface ITsunamiQueryHandler {
    map?: APIMap;
    mapView?: APIMapView;
    children?: React.ReactNode;
    setZoneTitle: React.Dispatch<React.SetStateAction<string>>;
    setZoneMessage: React.Dispatch<React.SetStateAction<string>>;
    setZoneColor: React.Dispatch<React.SetStateAction<string>>;
}

const TsunamiQueryHandler: React.FC<ITsunamiQueryHandler> = ({
    map,
    mapView,
    children,
    setZoneTitle,
    setZoneMessage,
    setZoneColor,
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
        console.log(event.position.coords);
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
        const query: __esri.QueryProperties = {
            spatialRelationship: "intersects",
            geometry: point,
            outFields: ["*"],
            returnGeometry: true,
        };
        var zoneFeature = undefined;
        const handleResult = (result: __esri.FeatureSet, index: number) => {
            if (result.features.length > 0) {
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
                        setZoneTitle(alertLevelInfo.messageTitle);
                        setZoneMessage(alertLevelInfo.messageBody);
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
            setZoneColor("rgb(242, 242, 242)");
        }
        // const resultIndex = results.findIndex(
        //     (result) => result.features.length > 0
        // );
        // if (resultIndex != -1) {
        //     console.log(results[resultIndex]);
        //     console.log("%cin Zone!!!", "color: red");
        //     console.log(layers[resultIndex]);
        // const layerZoneMapping = layerZoneMappings.find(
        //     (layerZoneMapping) =>
        //         layerZoneMapping.url ==
        //         `${layers[resultIndex].url}/${layers[resultIndex].layerId}`
        // );
        // if (layerZoneMapping) {
        //     const alertLevelInfo = layerZoneMapping.zoneDetails.find(
        //         (zone) =>
        //             zone.zoneFieldValue ==
        //             results[resultIndex].features[0].attributes[
        //                 layerZoneMapping.zoneField
        //             ]
        //     );
        //     if (alertLevelInfo) {
        //         setZoneTitle(alertLevelInfo.messageTitle);
        //         setZoneMessage(alertLevelInfo.messageBody);
        //         setZoneColor(alertLevelInfo.zoneAlertColor);
        //         console.log(
        //             `%c${alertLevelInfo.messageTitle} - ${alertLevelInfo.messageBody}`,
        //             `background-color: ${alertLevelInfo.zoneAlertColor}; color: black`
        //         );
        //     }
        // }
        // messageTitle: string;
        // messageBody: string;
        // zoneAlertColor: string;
        //   console.log(tsunamiZoneLayers[resultIndex]);
        //   // console.log("%cin Zone!!!", 'color: red')
        //   const zoneValue =
        //     results[resultIndex].features[0].attributes[
        //       tsunamiZoneLayers[resultIndex].zoneField
        //     ];
        //   const zoneDetails =
        //     tsunamiZoneLayers[resultIndex].zoneDetails[zoneValue];
        //   setZone(zoneDetails.title, zoneDetails.message, zoneDetails.color);
        // } else {
        //     console.log("%coutside zone :)", "color: grey");
        //   setZone(
        //     "Outside Tsunami Zone",
        //     "Handy Message for if outside zone",
        //     "rgb(242, 242, 242)"
        //   );
        // }
    };
    const triggerLocate = (locate: Locate) => {
        whenTrueOnce(locate.viewModel, "goToLocationEnabled", () => {
            locate.viewModel.locate();
        });
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
                    setZoneMapping: addLayerZoneMapping,
                    onLocate: onLocate,
                    setLocate: setLocate,
                });
            })}
        </>
    );
};

export default TsunamiQueryHandler;
