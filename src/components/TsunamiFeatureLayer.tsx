import React, { useEffect } from "react";
import APIMap from "@arcgis/core/Map";
import APIMapView from "@arcgis/core/views/MapView";
import APIFeatureLayer from "@arcgis/core/layers/FeatureLayer";
import APIGraphic from "@arcgis/core/Graphic";
import FeatureLayer from "./FeatureLayer";

export interface IFeatureLayerZoneMapping {
    // this object should allow mapping between a feature query url and zones with info
    // url: string;
    zoneField: string;
    zoneDetails: {
        zoneFieldValue: string;
        isRiskZone: boolean;
        messageTitle: string;
        messageBody?: string;
        messageBodyTemplate?: React.FC<{ attributes: any }>;
        zoneAlertColor: string;
    }[];
}

interface ITsunamiFeatureLayer {
    map?: APIMap;
    mapView?: APIMapView;
    // children?: React.ReactNode;
    url: string;
    warningTemplate: IFeatureLayerZoneMapping;
    setWarningTemplate?: (
        zoneMapping: IFeatureLayerZoneMapping & { url: string }
    ) => void;
    setLayer?: (layer: APIFeatureLayer) => void;
}

const TsunamiFeatureLayer: React.FC<ITsunamiFeatureLayer> = ({
    map,
    mapView,
    url,
    warningTemplate,
    setLayer,
    setWarningTemplate,
}) => {
    useEffect(() => {
        setWarningTemplate && setWarningTemplate({ ...warningTemplate, url });
    }, []);
    return <FeatureLayer url={url} setLayer={setLayer} map={map} />;
};

export default TsunamiFeatureLayer;
