import React from "react";

interface IWarningModal {
    title: string;
    body: string;
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
                zIndex: 10,
                padding: 10,
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                    overflow: "auto",
                    borderRadius: "10px",
                }}
            >
                <p style={{ backgroundColor: alertColor }}>{title}</p>
                <p>{body}</p>
                <button onClick={() => setShowing(false)}>Close</button>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default WarningModal;
