import React, { useEffect } from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureLayer from "./FeatureLayer";

export interface IFeatureLayerZoneMapping {
    // this object should allow mapping between a feature query url and zones with info
    // url: string;
    zoneField: string;
    zoneDetails: {
        zoneFieldValue: string;
        isRiskZone: boolean;
        messageTitle: string;
        messageBody: string;
        zoneAlertColor: string;
    }[];
}

interface ITsunamiFeatureLayer {
    map?: APIMap;
    mapView?: APIMapView;
    // children?: React.ReactNode;
    url: string;
    zoneMapping: IFeatureLayerZoneMapping;
    setZoneMapping?: (
        zoneMapping: IFeatureLayerZoneMapping & { url: string }
    ) => void;
    setLayer?: (layer: APIFeatureLayer) => void;
}

const TsunamiFeatureLayer: React.FC<ITsunamiFeatureLayer> = ({
    map,
    mapView,
    url,
    zoneMapping,
    setLayer,
    setZoneMapping,
}) => {
    useEffect(() => {
        setZoneMapping && setZoneMapping({ ...zoneMapping, url });
    }, []);
    return <FeatureLayer url={url} setLayer={setLayer} map={map} />;
};

export default TsunamiFeatureLayer;
