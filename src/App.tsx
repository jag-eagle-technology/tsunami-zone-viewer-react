import React, { useState } from "react";
import MapView from "./components/MapView";
import Map from "./components/Map";
import LightGreyBasemap from "./components/BaseMap";
import Point from "@arcgis/core/geometry/Point";
import FeatureLayer from "./components/FeatureLayer";
import Locate from "./components/Locate";
import TsunamiQueryHandler from "./components/TsunamiQueryHandler";
import TsunamiFeatureLayer, {
    IFeatureLayerZoneMapping,
} from "./components/TsunamiFeatureLayer";
import WarningModal from "./components/WarningModal";

const App: React.FC = () => {
    const [zoneTitle, setZoneTitle] = useState<string>("Loading Zone...");
    const [zoneMessage, setZoneMessage] = useState<string>(
        "Loading Zone Info..."
    );
    const [zoneColor, setZoneColor] = useState<string>("white");
    const [alertModalShowing, setAlertModalShowing] = useState<boolean>(false);
    const mapCenter = new Point({
        x: 1795999,
        y: 5457405,
        spatialReference: { wkid: 2193 },
    });
    const mapZoom = 5;

    const GWZoneMapping: IFeatureLayerZoneMapping = {
        zoneField: "Col_Code",
        zoneDetails: [
            {
                isRiskZone: true,
                zoneFieldValue: "yellow",
                messageTitle: "Yellow Zone",
                messageBody: "flee if it's big",
                zoneAlertColor: "rgb(254, 255, 166)",
            },
            {
                isRiskZone: true,
                zoneFieldValue: "orange",
                messageTitle: "Orange Zone",
                messageBody: "flee if it's biggish",
                zoneAlertColor: "rgb(255, 212, 166)",
            },
            {
                isRiskZone: true,
                zoneFieldValue: "red",
                messageTitle: "Red Zone",
                messageBody: "flee if it's small",
                zoneAlertColor: "rgb(255, 166, 166)",
            },
        ],
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 0,
                height: "100%",
                width: "100%",
            }}
        >
            <WarningModal
                title={zoneTitle}
                body={zoneMessage}
                alertColor={zoneColor}
                showing={alertModalShowing}
                setShowing={setAlertModalShowing}
            />
            <div>
                <h1 style={{ backgroundColor: zoneColor }}>{zoneTitle}</h1>
                <p>{zoneMessage}</p>
            </div>
            <div style={{ flexGrow: 1 }}>
                <MapView center={mapCenter} zoom={mapZoom}>
                    <Map>
                        <LightGreyBasemap />
                        <TsunamiQueryHandler
                            setZoneTitle={setZoneTitle}
                            setZoneMessage={setZoneMessage}
                            setZoneColor={setZoneColor}
                        >
                            <Locate position={"top-left"} />
                            <TsunamiFeatureLayer
                                url='https://mapping.gw.govt.nz/arcgis/rest/services/GW/Emergencies_P/MapServer/23'
                                zoneMapping={GWZoneMapping}
                            />
                            <FeatureLayer url='https://services1.arcgis.com/n4yPwebTjJCmXB6W/arcgis/rest/services/Tsunami_Evacuation_Zones/FeatureServer/0' />
                            <FeatureLayer url='https://topofthesouthmaps.co.nz/arcgis/rest/services/DataHazards/MapServer/0' />
                            <FeatureLayer url='https://services7.arcgis.com/8G10QCd84QpdcTJ9/arcgis/rest/services/evacuation_areas/FeatureServer/1' />
                            <FeatureLayer url='https://gis.marlborough.govt.nz/server/rest/services/OpenData/OpenData1/MapServer/16' />
                            <FeatureLayer url='https://services9.arcgis.com/QOkIjdWspeCZ4dcg/arcgis/rest/services/TRC%20Tsunami%20Inundation/FeatureServer/0' />
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
            </div>
        </div>
    );
};

export default App;
