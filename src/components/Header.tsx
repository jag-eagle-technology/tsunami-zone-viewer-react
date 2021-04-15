import React from 'react';
import headerStripImage from "./images/headerStripTitle.png";
import { ReactComponent as InfoIcon } from "../icons/info.svg";

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
                paddingTop: "0.75rem",
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
                    <h1 style={{ padding: 0, margin: 0 }}>{zoneTitle}</h1>
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

export default Header;