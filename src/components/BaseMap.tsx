import React, { useEffect } from "react";
import APIMapView from "@arcgis/core/views/MapView";
import APIMap from "@arcgis/core/Map";
import APIBasemap from "@arcgis/core/Basemap";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";

interface IBasemap {
    map?: APIMap;
}
export const LightGreyBasemap: React.FC<IBasemap> = ({ map }) => {
    const initBasemap = () => {
        if (!map) {
            throw new Error("no map set on basemap component");
        }
        // const nzLightGreyVector = new VectorTileLayer({
        //     portalItem: {
        //         id: "fed71141e42a45c49dabb30a4c2903e1",
        //     },
        // });
        const nzLightGreyVector = new VectorTileLayer({
            url:
                "https://www.arcgis.com/sharing/rest/content/items/fed71141e42a45c49dabb30a4c2903e1/resources/styles/root.json",
        });
        const basemap = new APIBasemap({
            baseLayers: [nzLightGreyVector],
        });
        map.basemap = basemap;
    };
    useEffect(() => {
        if (map) {
            initBasemap();
        }
    }, [map]);
    return <></>;
};
export const ImageryBasemap: React.FC<IBasemap> = ({ map }) => {
    const initBasemap = () => {
        if (!map) {
            throw new Error("no map set on basemap component");
        }
        // const nzLightGreyVector = new VectorTileLayer({
        //     portalItem: {
        //         id: "fed71141e42a45c49dabb30a4c2903e1",
        //     },
        // });
        const nzImageryLayer = new TileLayer({
            url:
                "https://services.arcgisonline.co.nz/arcgis/rest/services/Imagery/newzealand/MapServer",
        });
        const basemap = new APIBasemap({
            baseLayers: [nzImageryLayer],
        });
        map.basemap = basemap;
    };
    useEffect(() => {
        if (map) {
            initBasemap();
        }
    }, [map]);
    return <></>;
};

export default LightGreyBasemap;
