import React from "react";
import Map from "@arcgis/core/Map";
import Point from "@arcgis/core/geometry/Point";
import APIMapView from "@arcgis/core/views/MapView";
export type MapCenterLocation = {
    lat: number;
    lon: number;
    zoom: number;
};

interface IMapView {
    center?: Point;
    zoom?: number;
    children?: React.ReactNode;
    onMapClick?: __esri.MapViewClickEventHandler
}

const MapView: React.FC<IMapView> = ({ center, zoom, children, onMapClick }) => {
    const mapDivRef = React.useRef<HTMLDivElement>(null);
    const mapViewRef = React.useRef<APIMapView>();
    const [mapView, setMapView] = React.useState<APIMapView>();
    const initMapView = () => {
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
            center: center || undefined,
            zoom: zoom || undefined,
            spatialReference: {
                wkid: 2193
            }
        });
        mapViewRef.current = view;
        setMapView(view);
        view.when(() => {
            center && (view.center = center);
            zoom && (view.zoom = zoom);
        });
        onMapClick && view.on('click', onMapClick);
    };
    React.useEffect(() => {
        initMapView();
    }, []);
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div
                ref={mapDivRef}
                style={{ height: "100%", width: "100%" }}
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
