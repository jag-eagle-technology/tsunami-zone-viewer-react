import React from "react";
import Map from "@arcgis/core/Map";
import Point from "@arcgis/core/geometry/Point";
import APIMapView from "@arcgis/core/views/MapView";
import { whenTrue } from "@arcgis/core/core/watchUtils";
import { couldStartTrivia } from "typescript";
export type MapCenterLocation = {
    center: Point;
    zoom: number;
};

interface IMapView {
    center?: MapCenterLocation;
    setCenter?: React.Dispatch<React.SetStateAction<MapCenterLocation>>;
    components?: string[];
    children?: React.ReactNode;
    onMapClick?: __esri.MapViewClickEventHandler;
}

const MapView: React.FC<IMapView> = ({
    center,
    setCenter,
    children,
    onMapClick,
    components,
}) => {
    const mapDivRef = React.useRef<HTMLDivElement>(null);
    const mapViewRef = React.useRef<APIMapView>();
    const shouldUpdateCenterRef = React.useRef<boolean>(true);
    const timeoutUpdateCenterRef = React.useRef<NodeJS.Timeout>();
    const [mapView, setMapView] = React.useState<APIMapView>();
    const initMapView = () => {
        console.log('initiating map view');
        console.log(mapDivRef);
        if (!mapDivRef.current) {
            throw new Error("Map div is not defined");
        }
        if (mapView) {
            mapView.destroy();
            setMapView(undefined);
        }
        const view = new APIMapView({
            // map: new Map(),
            container: mapDivRef.current,
            center: center?.center || undefined,
            zoom: center?.zoom || undefined,
            spatialReference: {
                wkid: 2193,
            },
        });
        if (components) {
            view.ui.components = components;
        }
        mapViewRef.current = view;
        setMapView(view);
        view.when(() => {
            center && (view.center = center.center);
            center && (view.zoom = center.zoom);
        });
        onMapClick && view.on("click", onMapClick);
        whenTrue(mapViewRef.current, "stationary", () => {
            if (!mapViewRef.current) {
                return;
            }
            if (mapViewRef.current.zoom === -1) {
                return;
            }
            const centerLocation: MapCenterLocation = {
                center: mapViewRef.current.center,
                zoom: mapViewRef.current.zoom,
            };
            timeoutUpdateCenterRef.current &&
                clearTimeout(timeoutUpdateCenterRef.current);
            shouldUpdateCenterRef.current = false;
            setCenter && setCenter(centerLocation);
            timeoutUpdateCenterRef.current = setTimeout(
                () => (shouldUpdateCenterRef.current = true),
                250
            );
        });
    };
    React.useEffect(() => {
        initMapView();
    }, []);

    React.useEffect(() => {
        if (mapViewRef.current && shouldUpdateCenterRef.current && center) {
            mapViewRef.current.center = center.center;
            mapViewRef.current.zoom = center.zoom;
        }
    }, [center]);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div
                ref={mapDivRef}
                style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "antiquewhite",
                }}
            ></div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    mapView,
                });
            })}
        </div>
    );
};

export default MapView;
