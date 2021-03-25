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
import { ReactComponent as InfoIcon } from "./icons/info.svg";

import WarningModal from "./components/WarningModal";
import WellingtonWarningTemplate from "./components/WarningTemplates/WellingtonWarningTemplate";
import { NONAME } from "node:dns";

const App: React.FC = () => {
    const [zoneTitle, setZoneTitle] = useState<string>();
    const [zoneMessage, setZoneMessage] = useState<string>();
    const [
        zoneMessageTemplate,
        setZoneMessageTemplate,
    ] = useState<React.ReactElement>();
    const [zoneColor, setZoneColor] = useState<string>("white");
    const [inZone, setInZone] = useState<boolean>(false);
    const [querying, setQuerying] = useState<boolean>(false);
    const [alertModalShowing, setAlertModalShowing] = useState<boolean>(false);
    const mapCenter = new Point({
        x: 1795999,
        y: 5457405,
        spatialReference: { wkid: 2193 },
    });
    const mapZoom = 5;

    React.useEffect(() => {
        // also check and track source of query trigger
        if (inZone && !querying) {
            setAlertModalShowing(true);
        }
    }, [inZone, querying]);

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
                BodyTemplate={zoneMessageTemplate}
                alertColor={zoneColor}
                showing={alertModalShowing}
                setShowing={setAlertModalShowing}
            />
            <div style={{ fontFamily: "sans-serif" }}>
                <div
                    style={{
                        display: "flex",
                        backgroundColor: zoneColor,
                        padding: 10,
                        margin: 0,
                        color: "white",
                    }}
                >
                    <div>
                        <h1 style={{ padding: 0, margin: 0 }}>{zoneTitle}</h1>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                        <button
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                marginTop: "auto",
                                marginBottom: "auto",
                                height: "100%",
                            }}
                            onClick={() => setAlertModalShowing(true)}
                        >
                            <InfoIcon
                                style={{
                                    fill: "white",
                                    width: "25px",
                                    height: "100%",
                                }}
                            ></InfoIcon>
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ flexGrow: 1 }}>
                <MapView center={mapCenter} zoom={mapZoom}>
                    <Map>
                        <LightGreyBasemap />
                        <TsunamiQueryHandler
                            setZoneTitle={setZoneTitle}
                            setZoneMessage={setZoneMessage}
                            setZoneMessageTemplate={setZoneMessageTemplate}
                            setZoneColor={setZoneColor}
                            setInZone={setInZone}
                            setQuerying={setQuerying}
                        >
                            <Locate position={"top-left"} />
                            <TsunamiFeatureLayer
                                url='https://mapping.gw.govt.nz/arcgis/rest/services/GW/Emergencies_P/MapServer/23'
                                warningTemplate={WellingtonWarningTemplate}
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
