import React, { useState } from "react";
// import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
// import PolygonSymbol3D from '@arcgis/core/symbols/PolygonSymbol3D';
import MapView from "./components/MapView";
import Map from "./components/Map";
import LightGreyBasemap from "./components/BaseMap";
import Point from "@arcgis/core/geometry/Point";
import FeatureLayer from "./components/FeatureLayer";
import Locate from "./components/Locate";
import Search from "./components/Search";
import TsunamiQueryHandler from "./components/TsunamiQueryHandler";
import TsunamiFeatureLayer from "./components/TsunamiFeatureLayer";
import { ReactComponent as InfoIcon } from "./icons/info.svg";
import headerStripImage from "./images/headerStripTitle.png";
import WarningModal from "./components/WarningModal";
import WellingtonWarningTemplate from "./components/WarningTemplates/WellingtonWarningTemplate";
import WestCoastWarningTemplate from "./components/WarningTemplates/WestCoastWarningTemplate";

interface IHeader {
    zoneColor?: string;
    zoneTitle?: string;
    searchDivRef: React.RefObject<HTMLDivElement>;
    setAlertModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<IHeader> = ({
    zoneColor = "#005a9c",
    zoneTitle = "Select Zone or Search",
    searchDivRef,
    setAlertModalShowing,
}) => {
    return (
        <div
            style={{
                fontFamily: "sans-serif",
                backgroundImage: `url(${headerStripImage})`,
                backgroundRepeat: "repeat-x",
                backgroundPosition: "top",
                paddingTop: '0.75rem'
            }}
        >
            <div
                style={{
                    display: "flex",
                    // flex direction should be column for mobile
                    flexDirection: "column",
                    backgroundColor: zoneColor,
                    padding: "10px",
                    margin: 0,
                    color: "white",
                }}
            >
                <div>
                    <h1 style={{ padding: 0, margin: 0 }}>
                        {zoneTitle}
                    </h1>
                </div>
                <div style={{ /* marginLeft: "auto", */ display: "flex" }}>
                    <div
                        style={{
                            marginLeft: "10px",
                            marginRight: "10px",
                            flexGrow: 1,
                        }}
                        ref={searchDivRef}
                    ></div>
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
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [zoneTitle, setZoneTitle] = useState<string>();
    const [zoneMessage, setZoneMessage] = useState<string>();
    const [
        zoneMessageTemplate,
        setZoneMessageTemplate,
    ] = useState<React.ReactElement>();
    const [zoneColor, setZoneColor] = useState<string>("#005a9c");
    const [inZone, setInZone] = useState<boolean>(false);
    const [querying, setQuerying] = useState<boolean>(false);
    const [alertModalShowing, setAlertModalShowing] = useState<boolean>(false);
    const [address, setAddress] = useState<string>();
    const searchDivRef = React.useRef<HTMLDivElement>(null);
    const mapCenter = new Point({
        x: 1795999,
        y: 5457405,
        spatialReference: { wkid: 2193 },
    });
    const mapZoom = 5;

    // const buildingsRenderer = new SimpleRenderer({
    //     // type: "symbol", // autocasts as new UniqueValueRenderer()

    //     // set properties from previous steps here

    //     // define size visual variable based on height values in a field
    //     symbol: new PolygonSymbol3D({
    //         symbolLayers: [
    //             {
    //                 type: "extrude", // autocasts as new ExtrudeSymbol3DLayer()
    //                 size: 10, // 100,000 meters in height
    //                 material: { color: "red" },
    //             },
    //         ],
    //     }),
    // });

    React.useEffect(() => {
        // also check and track source of query trigger
        if (inZone && !querying) {
            setAlertModalShowing(true);
        }
    }, [inZone, querying]);

    // configure geocoder for search widget

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
                address={address}
                alertColor={zoneColor}
                showing={alertModalShowing}
                setShowing={setAlertModalShowing}
            />
            <Header
                zoneColor={zoneColor}
                zoneTitle={zoneTitle}
                searchDivRef={searchDivRef}
                setAlertModalShowing={setAlertModalShowing}
            />
            <div style={{ flexGrow: 1 }}>
                {/* <MapView center={mapCenter} zoom={mapZoom} type='2d'> */}
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
                            setAddress={setAddress}
                        >
                            <Locate position={"top-left"} />
                            <Search
                                searchDiv={searchDivRef}
                                popupEnabled={false}
                            />
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
                            {/* <FeatureLayer url='https://gis.westcoast.govt.nz/arcgis/rest/services/EmergencyManagementAndHazards/TsunamiEvacuationZones/MapServer/0' /> */}
                            <TsunamiFeatureLayer
                                url='https://gis.westcoast.govt.nz/arcgis/rest/services/EmergencyManagementAndHazards/TsunamiEvacuationZones/MapServer/0'
                                warningTemplate={WestCoastWarningTemplate}
                            />
                        </TsunamiQueryHandler>
                        {/* <FeatureLayer url='https://services7.arcgis.com/jI87xPT7G1AGV8Uo/arcgis/rest/services/LINZ_NZ_Building_Outlines/FeatureServer' renderer={buildingsRenderer} /> */}
                    </Map>
                </MapView>
            </div>
        </div>
    );
};

export default App;
