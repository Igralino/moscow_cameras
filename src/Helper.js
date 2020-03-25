let turf = require("@turf/turf");
let fs = require('fs');
let data = JSON.parse(fs.readFileSync("/Users/igralino/Documents/HSE/nis_cameras/src/data/data.json", 'utf8'));

const bbox = [36.984994, 56.081953, 38.259408, 55.393966];
const cellSide = 0.8;
const hexGridRes = turf.hexGrid(bbox, cellSide, {});
let features = [];
hexGridRes.features.forEach(polygon => {
    let result = turf.pointsWithinPolygon(data, polygon);
    polygon.properties["data"] = [];
    for (let i = 0; i<11; i++){
        polygon.properties["data"][i] = {
            massCount: result.features.filter(r => r.properties.data_type === "mass" && r.properties.version === i).length,
            courtCount: result.features.filter(r => r.properties.data_type === "court" && r.properties.version === i).length,
            porchCount: result.features.filter(r => r.properties.data_type === "porch" && r.properties.version === i).length,
            roadCount: result.features.filter(r => r.properties.data_type === "road" && r.properties.version === i).length
        };
    }
    features.push(JSON.parse(JSON.stringify(polygon)));
});
hexGridRes.features = features;

fs.writeFileSync("/Users/igralino/Documents/HSE/nis_cameras/src/data/hexGrid.json", JSON.stringify(hexGridRes));
