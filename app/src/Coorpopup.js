import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import './style.css';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';



const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Atest1&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857', 
  
});


const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new Icon({
      src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
    })
  })
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


  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');


  const popup = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
    duration: 250
  }
  });

  map.addOverlay(popup);


  closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
  };
  

  map.on('click', function (event) {

    const features = map.getFeaturesAtPixel (event.pixel);

     if (features.length > 0){
      const ele = document.getElementById('popuptext');
      ele.innerHTML = features[0].get("name");  
      console.log(features[0].getProperties())

      const coordinates = features[0].getGeometry().getCoordinates();

      popup.setPosition(coordinates);
    }
  });
