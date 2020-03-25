import React, {Component} from 'react';
import './App.css';
import MapGL, {Layer, Source} from 'react-map-gl';
import style from "./data/style.json"
import hexData from "./data/hexGrid"

import {Box, RadioButton, RangeInput} from "grommet";
import BarChart from "./images/BarChart.png"

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaWdyYWxpbm8iLCJhIjoiY2s4MGRsOWd5MGV5djNndW5uNWs2cHNpdiJ9.gDZdVacnaQV-XrAOdY2SmA';


class App extends Component {
    hexGridLayer = {
        'type': 'fill-extrusion',
        'paint': {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                0, "#ff0000",
                0.8, "#14f507"
            ],
            // Get fill-extrusion-height from the source 'height' property.

            'fill-extrusion-height': ['*', ['get', 'height'], 10000],
            'fill-extrusion-opacity': 0.5
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            data: hexData,
            mode: "3D",
            selected: "mass",
            version: 0,
            viewport: {
                longitude: 37.6,
                latitude: 55.69100385788888,
                zoom: 9.2,
                bearing: -8,
                pitch: 49
            }
        };
    }

    componentDidMount() {
        this.recountData(this.state.selected, this.state.version);
    }

    RadioButtonChanger = (type) => {
        this.setState({selected: type});
        this.recountData(type, this.state.version);
    };

    recountData = (type, version) => {
        this.setState({version});
        let data = hexData;
        let maxCount = 0;

        data.features.forEach(polygon => {
            let height = 0;
            switch (type) {
                case "mass":
                    height += polygon.properties.data[version].massCount;
                    break;
                case "court":
                    height += polygon.properties.data[version].courtCount;
                    break;
                case "porch":
                    height += polygon.properties.data[version].porchCount;
                    break;
                case "road":
                    height += polygon.properties.data[version].roadCount;
                    break;
                default:
                    break;
            }
            if (height >= maxCount) {
                maxCount = height;
            }

            polygon.properties.height = height;
        });

        let filteredData = Object.assign({}, data);
        filteredData.features = filteredData.features.filter(polygon => polygon.properties.height !== 0);
        filteredData.features.forEach(polygon => {
            polygon.properties.height /= maxCount;
        });
        this.setState({data: filteredData});
    };


    render() {
        return (
            <div className="App">

                <div className="LeftLegend">
                    <div className="LegendContent">
                        <div className="Heading">Moscow Camera Visualization</div>
                        <div style={{alignItems: "center"}}>
                            <div className="BarChart" style={{backgroundImage: `url(${BarChart})`}}/>
                            <Box align="start" pad="small" gap="small">
                                <RadioButton label="Cameras in gathering areas"
                                             name="mass"
                                             checked={this.state.selected === "mass"}
                                             onChange={() => {
                                                 this.RadioButtonChanger("mass")
                                             }}/>
                                <RadioButton label="Court cameras"
                                             name="court"
                                             checked={this.state.selected === "court"}
                                             onChange={() => {
                                                 this.RadioButtonChanger("court")
                                             }}/>
                                <RadioButton label="Porch cameras"
                                             name="porch"
                                             checked={this.state.selected === "porch"}
                                             onChange={() => {
                                                 this.RadioButtonChanger("porch")
                                             }}/>
                                <RadioButton label="Road cameras"
                                             checked={this.state.selected === "road"}
                                             name="road"
                                             onChange={() => {
                                                 this.RadioButtonChanger("road")
                                             }}/>
                                <RangeInput
                                    value={this.state.version}
                                    min={0}
                                    max={10}
                                    step={1}
                                    onChange={event => this.recountData(this.state.selected, event.target.value)}
                                />
                                <div className="PickerSubtitle">
                                    <div className="PickerRight">2016</div>
                                    <div className="PickerLeft">2020</div>

                                </div>

                            </Box>
                        </div>
                    </div>
                </div>

                <MapGL
                    {...this.state.viewport}
                    width="100vw"
                    height="100vh"
                    mapStyle={style}
                    onViewportChange={viewport => this.setState({viewport})}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                >
                    <Source type="geojson" data={this.state.data}>
                        <Layer {...this.hexGridLayer}/>
                    </Source>

                </MapGL>
            </div>
        );
    }
}

export default App;
