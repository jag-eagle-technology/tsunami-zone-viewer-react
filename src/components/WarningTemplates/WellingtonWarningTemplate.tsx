import React from "react";
import { IFeatureLayerZoneMapping } from "../TsunamiFeatureLayer";

interface WellingtonAttributes {
    OBJECTID: number;
    FID_Wellington_Region_Tsunami_E: number;
    Zone_Class: number;
    Col_Code: string;
    Evac_Zone: string;
    Location: string;
    Info: string;
    Heights: string;
    Instruction: string;
    "Shape__Area": number;
    "Shape__Length": number;
}

const Template: React.FC<{ attributes: any }> = ({ attributes }) => {
    const [evacZone, setEvacZone] = React.useState<string>();
    const [heights, setHeights] = React.useState<string>();
    const [info, setInfo] = React.useState<string>();
    React.useEffect(() => {
        const wellingtonZoneAttributes = attributes as WellingtonAttributes;
        setEvacZone(wellingtonZoneAttributes.Evac_Zone);
        setHeights(wellingtonZoneAttributes.Heights);
        setInfo(wellingtonZoneAttributes.Info);
    }, [attributes]);
    return (
        <div>
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
            <h3>Heights</h3>
            <p>{heights}</p>
            <h3>Info</h3>
            <p>{info}</p>
        </div>
    );
};

const WellingtonWarningTemplate: IFeatureLayerZoneMapping = {
    zoneField: "Col_Code",
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

export default WellingtonWarningTemplate;
