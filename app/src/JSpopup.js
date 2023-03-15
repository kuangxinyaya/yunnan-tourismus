import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {toLonLat} from 'ol/proj.js';
import {toStringHDMS} from 'ol/coordinate.js';


let location = [
  ['dianmonkey',99.368846, 27.628571, "red"],
];

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');


const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});


closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


const key = 'n3VVBAGpfDf3R3E3zmP9';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';


const map = new Map({
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=n3VVBAGpfDf3R3E3zmP9',
        tileSize: 512,
      }),
    }),
  ],
  overlays: [overlay],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});


map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = '<p>Hier is:</p><code>' + hdms + '</code>';
  overlay.setPosition(coordinate);
});