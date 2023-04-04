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
import Feature from 'ol/Feature';
import { transformExtent } from 'ol/proj';
import { Polygon } from 'ol/geom';
import {transform} from 'ol/proj';
import {GeoJSON, WFS} from 'ol/format.js';
import {
  and as andFilter,
  equalTo as equalToFilter,
  like as likeFilter,
} from 'ol/format/filter.js';

const vectorSorcepoly = new VectorSource({
  features: [],
});

const vectorlayerpoly = new VectorLayer({
  source: vectorSorcepoly,
});

const naturschutzSource = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Anaturschutz&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857', 
  
});

const naturlanSource = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Anaturlandschaft&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857', 
  
});

const naturschutzLayer = new VectorLayer({
  source: naturschutzSource,
  style: new Style({
    image: new Icon({
      src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
    })
  })
});

const naturlanLayer = new VectorLayer({
  source: naturlanSource,
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
  layers: [raster, vectorlayerpoly,naturschutzLayer,naturlanLayer],
  target: document.getElementById('map'),
  view: new View({
    center: transform([100.16999583318919, 25.287884028102884], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  }),
});


//popup
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');
  const img1 = document.getElementById('img1');

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
      
      const bilder = features[0].get('bilder');
      const img1 = document.getElementById('img1');
      img1.setAttribute("src", bilder);
      
      const intro = document.getElementById('intro11');
      intro.innerHTML = features[0].get("intro");

      const progress = features[0].get('progress');
      const prog = document.getElementById('pro1');
      prog.setAttribute("value", progress);

      const coordinates = features[0].getGeometry().getCoordinates();
      popup.setPosition(coordinates);
    }
  });


  //passende Markers für passende Layers
    const all = document.getElementById('nav-item-all');
    const nl = document.getElementById('nav-item-nl');
    const ns = document.getElementById('nav-item-ns');
    const kl = document.getElementById('nav-item-kl');

    all.addEventListener('click', function(){
      naturlanLayer.setVisible(true);
      naturschutzLayer.setVisible(true);
    });
   
    nl.addEventListener('click', function(){
      naturlanLayer.setVisible(true);
      naturschutzLayer.setVisible(false);
    });

    ns.addEventListener('click', function(){
      naturschutzLayer.setVisible(true);
      naturlanLayer.setVisible(false);
    });

    kl.addEventListener('click', function(){
      naturschutzLayer.setVisible(false);
      naturlanLayer.setVisible(false);
    });


    //Position durch input und search-button
    const input = document.getElementById('site-search');

    const suchen = document.getElementById('button');
    suchen.addEventListener('click', async function(){
      const response = await fetch ('https://nominatim.openstreetmap.org/search?format=geojson&q=' + input.value + '&polygon_geojson=1'); 
      const result = await response.json();
      const transformedExtent = transformExtent(result.features[0].bbox , 'EPSG:4326', 'EPSG:3857');

    //Position als Poly zurükgeben
      const vectorpoly = new GeoJSON({
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }).readFeature(result.features[0]);
      vectorSorcepoly.clear();
      vectorSorcepoly.addFeature(vectorpoly);

      map.getView().fit(transformedExtent);
   });
   
   suchen.addEventListener('click', async function() {
    const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featureNS: 'http://openstreemap.org',
    featurePrefix: 'osm',
    featureTypes: ['naturschutz','naturlandschaft'],
    outputFormat: 'application/json',
    filter: likeFilter('name', input.value),
  });

  fetch('http://localhost:8081/geoserver/yunnan/ows?service=WFS', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const vectorpoly = new GeoJSON().readFeatures(json);
      vectorSorcepoly.clear();
      vectorSorcepoly.addFeature(vectorpoly[0]);

      map.getView().fit(json.bbox, {
        maxZoom: 12,
      });

    });
 });

   //Trigger Button Click on Enter
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button").click();
    }
   });
   

   //Position als Marker zurück
  //  const input2 = document.getElementById('site-search2');
  //  const wfssuchen = document.getElementById('button2');

  //  wfssuchen.addEventListener('click', async function() {
  //   const featureRequest = new WFS().writeGetFeature({
  //     srsName: 'EPSG:3857',
  //     featureNS: 'http://openstreemap.org',
  //     featurePrefix: 'osm',
  //     featureTypes: ['naturschutz','naturlandschaft'],
  //     outputFormat: 'application/json',
  //     filter: likeFilter('name', input2.value),
  //   });
    
  //   fetch('http://localhost:8081/geoserver/yunnan/ows?service=WFS', {
  //     method: 'POST',
  //     body: new XMLSerializer().serializeToString(featureRequest),
  //   })
  //     .then(function (response) {
  //       return response.json();
  //     })
  //     .then(function (json) {
  //       const vectorpoly = new GeoJSON().readFeatures(json);
  //       vectorSorcepoly.clear();
  //       vectorSorcepoly.addFeature(vectorpoly[0]);

  //       map.getView().fit(json.bbox, {
  //         maxZoom: 10,
  //       });

  //     });
  //  });
