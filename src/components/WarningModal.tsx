import React from "react";
import { ReactComponent as WarningIcon } from "../icons/warning.svg";

interface IWarningModal {
    title?: string;
    body?: string;
    BodyTemplate?: React.ReactElement;
    alertColor: string;
    showing: boolean;
    setShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const WarningModal: React.FC<IWarningModal> = ({
    title,
    body,
    alertColor,
    showing,
    setShowing,
    BodyTemplate,
}) => {
    return showing ? (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.75)",
                zIndex: 9999,
                padding: 10,
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "white",
                    overflow: "auto",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <div
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        paddingTop: "25px",
                        paddingBottom: "25px",
                    }}
                >
                    <WarningIcon style={{ fill: alertColor }} />
                </div>
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "x-large",
                        color: alertColor,
                    }}
                >
                    {title}
                </div>
                <div style={{ padding: 25 }}>
                    {body && body}
                    {BodyTemplate && BodyTemplate}
                </div>
                <div
                    style={{
                        marginTop: "auto",
                        paddingBottom: "25px",
                        paddingTop: "25px",
                        display: "flex",
                    }}
                >
                    <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                        <button
                            style={{
                                cursor: "pointer",
                                color: "white",
                                fontWeight: 'bold',
                                fontSize: 'large',
                                backgroundColor: alertColor,
                                border: "none",
                                padding: "10px",
                                paddingLeft: "30px",
                                paddingRight: "30px",
                                borderRadius: "5px",
                                boxShadow:
                                    "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)",
                            }}
                            onClick={() => setShowing(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default WarningModal;
