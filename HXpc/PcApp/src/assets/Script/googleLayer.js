define(["dojo/_base/declare",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/geometry/Point",
    "esri/layers/TileInfo",
    "esri/layers/TiledMapServiceLayer"], function (declare, Extent, SpatialReference, Point, TileInfo, TiledMapServiceLayer) {
        return declare("googleLayer", TiledMapServiceLayer, {
            layertype: "Vector",//图层类型
            constructor: function (args) {
                this.spatialReference = new SpatialReference({
                    wkid: 102113
                });
                declare.safeMixin(this, args);
                this.fullExtent = new Extent(-20037508.342787,
                    -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference);
                this.initialExtent = this.fullExtent;
                this.tileInfo = new TileInfo({
                    "rows": 256,
                    "cols": 256,
                    "dpi": 96,
                    "format": "JPEG",
                    "compressionQuality": 90,
                    "origin": {
                        "x": -20037508.342787,
                        "y": 20037508.342787
                    },
                    "spatialReference": {
                        "wkid": 102113
                    },
                    "lods": [
                        { "level": 0, "resolution": 156543.033928, "scale": 591657527.591555 },
                        { "level": 1, "resolution": 78271.5169639999, "scale": 295828763.795777 },
                        { "level": 2, "resolution": 39135.7584820001, "scale": 147914381.897889 },
                        { "level": 3, "resolution": 19567.8792409999, "scale": 73957190.948944 },
                        { "level": 4, "resolution": 9783.93962049996, "scale": 36978595.474472 },
                        { "level": 5, "resolution": 4891.96981024998, "scale": 18489297.737236 },
                        { "level": 6, "resolution": 2445.98490512499, "scale": 9244648.868618 },
                        { "level": 7, "resolution": 1222.99245256249, "scale": 4622324.434309 },
                        { "level": 8, "resolution": 611.49622628138, "scale": 2311162.217155 },
                        { "level": 9, "resolution": 305.748113140558, "scale": 1155581.108577 },
                        { "level": 10, "resolution": 152.874056570411, "scale": 577790.554289 },
                        { "level": 11, "resolution": 76.4370282850732, "scale": 288895.277144 },
                        { "level": 12, "resolution": 38.2185141425366, "scale": 144447.638572 },
                        { "level": 13, "resolution": 19.1092570712683, "scale": 72223.819286 },
                        { "level": 14, "resolution": 9.55462853563415, "scale": 36111.909643 },
                        { "level": 15, "resolution": 4.77731426794937, "scale": 18055.954822 },
                        { "level": 16, "resolution": 2.38865713397468, "scale": 9027.977411 },
                        { "level": 17, "resolution": 1.19432856685505, "scale": 4513.988705 },
                        { "level": 18, "resolution": 0.597164283559817, "scale": 2256.994353 },
                        { "level": 19, "resolution": 0.298582141647617, "scale": 1128.497176 }
                    ]
                });

                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                //h skeleton map light  http://mt2.google.cn/vt/lyrs=h&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    m 全地图   http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    p terrain+map  http://mt2.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    r skeleton map dark   http://mt2.google.cn/vt/lyrs=r&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    y hybrid satellite map   http://mt1.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    t 地形图   http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x=420&y=193&z=9
                //    s 卫星地图   http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=420&y=193&z=9

                var s = "Galileo".substring(0, ((3 * col + row) % 8));
                var url = "";
                if (this.layertype == "Vector") {//获取矢量地图  
                    var url = "http://mt" + (col % 4) + ".google.cn/vt/v=w2.114&hl=zh-CN&gl=cn&" +
                        "x=" + col + "&" +
                        "y=" + row + "&" +
                        "z=" + level + "&s=";
                }
                else if (this.layertype == "Terrain") {//获取地形图
                    var url = "http://mt" + (col % 4) + ".google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&" +
                        "x=" + col + "&" +
                        "y=" + row + "&" +
                        "z=" + level + "&" +
                        "s=" + s;
                }
                else if (this.layertype == "Image") {
                    var url = "http://mt3.google.cn/vt/lyrs=" + "s" + "&hl=zh-CN&gl=CN&" + "x=" + col + "&" + "y=" + row + "&" + "z=" + level;
                }
                return url;
            }
        });
    });