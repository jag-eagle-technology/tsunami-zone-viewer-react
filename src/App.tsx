import React from "react";
import MapView from "./components/MapView";
import Map from "./components/Map";
import LightGreyBasemap from "./components/BaseMap";
import Point from "@arcgis/core/geometry/Point";
import FeatureLayer from "./components/FeatureLayer";
import TsunamiQueryHandler from "./components/TsunamiQueryHandler";

const App: React.FC = () => {
    const mapCenter = new Point({
        x: 1795999,
        y: 5457405,
        spatialReference: { wkid: 2193 },
    });
    const mapZoom = 5;

    return (
        <MapView center={mapCenter} zoom={mapZoom}>
            <Map>
                <LightGreyBasemap />
                <TsunamiQueryHandler>
                    <FeatureLayer url='https://mapping.gw.govt.nz/arcgis/rest/services/GW/Emergencies_P/MapServer/23' />
                    <FeatureLayer url='https://services1.arcgis.com/n4yPwebTjJCmXB6W/arcgis/rest/services/Tsunami_Evacuation_Zones/FeatureServer/0' />
                    <FeatureLayer url='https://topofthesouthmaps.co.nz/arcgis/rest/services/DataHazards/MapServer/0' />
                    <FeatureLayer url='https://services7.arcgis.com/8G10QCd84QpdcTJ9/arcgis/rest/services/evacuation_areas/FeatureServer/1' />
                    <FeatureLayer url='https://gis.marlborough.govt.nz/server/rest/services/OpenData/OpenData1/MapServer/16' />
                    <FeatureLayer url='https://services9.arcgis.com/QOkIjdWspeCZ4dcg/arcgis/rest/services/TRC Tsunami Inundation/FeatureServer/0' />
                    <FeatureLayer url='https://services7.arcgis.com/cJyn351KIix0PiKq/arcgis/rest/services/Hawkes_Bay_Tsunami_Evacuation_Zones/FeatureServer/0' />
                    <FeatureLayer url='https://services1.arcgis.com/VuN78wcRdq1Oj69W/arcgis/rest/services/TsunamiEvacuationZones2016/FeatureServer/0' />
                    <FeatureLayer url='https://services1.arcgis.com/n4yPwebTjJCmXB6W/arcgis/rest/services/Tsunami_Evacuation_Zones/FeatureServer/0' />
                    <FeatureLayer url='https://maps.es.govt.nz/server/rest/services/Public/NaturalHazards/MapServer/8' />
                    <FeatureLayer url='https://gis.boprc.govt.nz/server2/rest/services/BayOfPlentyMaps/CivilDefenceEmergencyManagement/MapServer/17' />
                    <FeatureLayer url='https://services1.arcgis.com/RNxkQaMWQcgbiF98/arcgis/rest/services/Tsunami_Evacuation_Zones/FeatureServer/4' />
                    <FeatureLayer url='https://gis.ecan.govt.nz/arcgis/rest/services/Public/Geological_Hazards/MapServer/6' />
                    <FeatureLayer url='https://gis.westcoast.govt.nz/arcgis/rest/services/EmergencyManagementAndHazards/TsunamiEvacuationZones/MapServer/0' />
                </TsunamiQueryHandler>
            </Map>
        </MapView>
    );
};

export default App;
