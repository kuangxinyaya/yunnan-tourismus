import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import './style.css';
import Icon from 'ol/style/Icon';

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Atest1&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857', 
  
});

const vectorSource2 = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Anationalpark_xishuang&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857', 
  
});

const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new Icon({
      src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
    })
  })
});

const vector2 = new VectorLayer({
  source: vectorSource2,
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
  layers: [raster, vector,vector2],
  target: document.getElementById('map'),
  view: new View({
    center: [0,0],
    zoom: 1,
  }),
});


// Overlay hinzufügen

// const element = document.getElementById('popup');

// const popup = new Overlay({
//   element: element,
//   positioning: 'bottom-center',
//   stopEvent: false,
// });
// map.addOverlay(popup);

// Auf klick reagieren

map.on('click', function (evt) {
    // alle features bekommen. Code ist nicht vollständig!
    // map.getFeaturesAtPixel(evt.pixel);
  
    // get name of feature
    // feature.get('name');
  
    // zeige Name von feature in popup an (Name dem `element` hinzufügen)
  });


  const popup = new Overlay({
    element: document.getElementById('popup'),

  });

  map.addOverlay(popup);

  map.on('click', function (event) {

    const features = map.getFeaturesAtPixel (event.pixel);
     if (features.length > 0){
      const ele = document.getElementById('popup');
      ele.innerHTML = features[0].get("name");  
      console.log(features[0].getProperties())

      popup.setPosition(fromLonLat([99.379690, 27.599902]));
    }
  });
