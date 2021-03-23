import React from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";

interface ITsunamiQueryHandler {
    map?: APIMap;
    mapView?: APIMapView;
    children?: React.ReactNode;
}

const TsunamiQueryHandler: React.FC<ITsunamiQueryHandler> = ({
    map,
    mapView,
    children,
}) => {
    const [layers, setLayers] = React.useState<APIFeatureLayer[]>([]);
    const addLayer = (featureLayer: APIFeatureLayer) =>
        setLayers((layers) => [...layers, featureLayer]);

    const initTsunamiQueryHandler = () => {
        if (!mapView) {
            throw new Error("no mapView set for tsunamiQueryHandler");
        }
        const clickHandler = mapView.on("click", (event) => {
            console.log(event);
        });
    };

    React.useEffect(() => {
        if (mapView) {
            initTsunamiQueryHandler();
        }
    }, [mapView]);

    return (
        <>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    mapView,
                    map,
                    setLayer: addLayer,
                });
            })}
        </>
    );
};

export default TsunamiQueryHandler;
