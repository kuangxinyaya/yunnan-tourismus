import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import Style from 'ol/style/Style';
import './style.css';
import { fromLonLat } from 'ol/proj';
import Icon from 'ol/style/Icon';

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Adianmonkey&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857'

});

const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new Icon({
      src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
    })
  })
  // style: {
  //   'stroke-width': 0.75,
  //   'stroke-color': 'white',
  //   'fill-color': 'rgba(100,100,100,0.25)',
  // },
});

const raster = new TileLayer({
  source: new OSM()
});

const map = new Map({
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new View({
    center: [0,0],
    zoom: 1,
  }),
});
