import React from "react";
import { IFeatureLayerZoneMapping } from "../TsunamiFeatureLayer";
import logo from "../../logos/westCoastIconFull.png";

interface WestCoastAttributes {
    OBJECTID: number;
    Shape_Leng: number;
    Evacuation: "Orange" | "Red" | "Yellow";
    Descr: string;
    SymbolID: string;
    GlobalID: string;
    SHAPE_Length: number;
    SHAPE_Area: number;
}

const Template: React.FC<{ attributes: any }> = ({ attributes }) => {
    const [evacZone, setEvacZone] = React.useState<string>();
    const [info, setInfo] = React.useState<string>();
    React.useEffect(() => {
        const westCoastZoneAttributes = attributes as WestCoastAttributes;
        setInfo(westCoastZoneAttributes.Descr);
        setEvacZone(attributes.Evacuation);
    }, [attributes]);
    return (
        <div>
            <div style={{width: '100%'}}>
                <img
                    src={logo}
                    style={{ marginLeft: "auto", marginRight: "auto", display: 'block' }}
                ></img>
            </div>
            <h2>Long or Strong? Get Gone!</h2>
            <p>
                If you feel an earthquake that is either longer than a minute OR
                strong enough that it’s hard to stand up, as soon as the shaking
                stops, get to high ground, out of all zones (past the blue
                line)! If there is an official warning, then evacuate from the
                zones (red, orange or yellow) as stated in the warning.
            </p>
            <h3>Evacuation Zone</h3>
            <p>{evacZone}</p>
            <h3>Info</h3>
            <p>{info}</p>
        </div>
    );
};

const WestCoastWarningTemplate: IFeatureLayerZoneMapping = {
    zoneField: "Evacuation",
    zoneDetails: [
        {
            isRiskZone: true,
            zoneFieldValue: "Yellow",
            messageTitle: "Yellow Zone",
            messageBodyTemplate: Template,
            zoneAlertColor: "rgb(241, 245, 0)",
        },
        {
            isRiskZone: true,
            zoneFieldValue: "Orange",
            messageTitle: "Orange Zone",
            messageBodyTemplate: Template,
            zoneAlertColor: "rgb(245, 131, 0)",
        },
        {
            isRiskZone: true,
            zoneFieldValue: "Red",
            messageTitle: "Red Zone",
            messageBodyTemplate: Template,
            zoneAlertColor: "rgb(245, 0, 0)",
        },
    ],
};

export default WestCoastWarningTemplate;
