import './style.css';
import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';



const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});


const marker = new VectorLayer({
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Point(
          fromLonLat([99.379690, 27.599902])
        )
      })
    ],
  }),
  style: new Style({
    image: new Icon({
      src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
    })
  })
});



map.addLayer(marker);