import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import './style.css';
import Icon from 'ol/style/Icon';
import { transform } from 'ol/proj';
import { GeoJSON, WFS } from 'ol/format.js';
import Cluster from 'ol/source/Cluster.js';
import { Feature } from "ol";
import {boundingExtent} from 'ol/extent';
import {
  Select,
  Translate,
  defaults as defaultInteractions,
} from 'ol/interaction.js';


import { setupPopup } from './popup';
import { positionsuchen } from './positionSuchen';
import { menu } from './menu';
import { bear } from './beardragJS';
import { transactWFS } from './transaction';


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


//WFS marker
// const wfsbearSource = new VectorSource({
//   format: new GeoJSON(),
//   url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Abearmarker&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857',
// })


// const wfsbearStyle = new Style({
//   image: new Icon({
//     src: './assets/bearicon.png',
//     scale: 0.1,
//   }),
// });

// const wfsbearLayer = new VectorLayer({
//   name: "wfsbear",
//   source: wfsbearSource,
//   style: wfsbearStyle,
//   })


// Marker
const naturschutzLayer = new VectorLayer({
  name: "naturschutzLayer",
  source: naturschutzSource,
  style: new Style({
    image: new Icon({
      src: '../assets/marker5.png',
      scale: 0.1,
    }),
  })
});

const naturlanLayer = new VectorLayer({
  name: "naturlanLayer",
  source: naturlanSource,
  style: new Style({
    image: new Icon({
      src: '../assets/marker6.png',
      scale: 0.1,
    })
  })
});


//  Drag Marker
const dragmarker = document.getElementById('box1');

const iconStyle = new Style({
  image: new Icon({
    src: './assets/bearicon.png',
    scale: 0.12,
  }),
});

const dragvectorSouce = new VectorSource({
  format: new GeoJSON(),
  url: 'http://localhost:8081/geoserver/yunnan/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yunnan%3Abearmarker&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857',
  // features: [],
});

const dragvectorLayer = new VectorLayer({
  name: "bearLayer",
  style: iconStyle,
  source: dragvectorSouce,
});



// cluster marker
const clusterns = new Cluster({
  source: naturschutzSource,
  distance: 300,
});


const clusternslayer = new VectorLayer({
  name: "Cluster Layer",
  source: clusterns,
  style: function (feature, resolution) {
    const size = feature.get('features').length;
    if (size > 1) {
      return new Style({
        image: new Icon({
          src: '../assets/marker5.png',
          scale: 0.1,
        })
      })
    } else {
      return new Style({
        image: new Icon({
          src: '../assets/marker5.png',
          scale: 0.1,
        }),
      })
    }
  }

})

const clusternl = new Cluster({
  source: naturlanSource,
  distance: 100,
});


const clusternlayer = new VectorLayer({
  name: "Cluster Layernl",
  source: clusternl,
  style: function (feature, resolution) {
    const size = feature.get('features').length;
    if (size > 1) {
      return new Style({
        image: new Icon({
          src: '../assets/marker6.png',
          scale: 0.1,
        })
      })
    } else {
      return new Style({
        image: new Icon({
          src: '../assets/marker6.png',
          scale: 0.1,
        }),
      })
    }
  }

})


// const clusterbear = new Cluster({
//   source: dragvectorSouce,
//   distance: 200,
// });


// const clusterbearlayer = new VectorLayer({
//   name: "Cluster Layerbear",
//   source: clusterbear,
//   style: function (feature, resolution) {
//     const size = feature.get('features').length;
//     if (size > 1) {
//       return new Style({
//         image: new Icon({
//           src: './assets/bearicon.png',
//           scale: 0.1,
//         })
//       })
//     } else {
//       return new Style({
//         image: new Icon({
//           src: './assets/bearicon.png',
//           scale: 0.1,
//         }),
//       })
//     }
//   }

// })


// Rasterlayer
const raster = new TileLayer({
  name: "OSM",
  source: new OSM()
});


//move bearmarker
// const select = new Select({
//   layers: [dragvectorLayer],
//   // condition: pointerMove
// });



// select.on("select", function (evt) {

//   console.log("SELECTED FEATURE!")
// });

const translate = new Translate({
  layers:[dragvectorLayer],
});


translate.on("translateend", async function(evt){
  const features = evt.features.getArray();
  const feature = features[0];

  if(evt.mapBrowserEvent.originalEvent.target.id == "box2") {
    await transactWFS('delete',feature);
  } else {
    await transactWFS('update',feature);
  }

  dragvectorSouce.refresh();
})



// map 
const map = new Map({
  interactions: defaultInteractions().extend([translate]),
  layers: [raster, vectorlayerpoly,dragvectorLayer,clusternslayer,clusternlayer],
  target: document.getElementById('map'),
  view: new View({
    center: transform([100.16999583318919, 25.287884028102884], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  }),

});


bear(map, dragvectorSouce);
const popupclose = setupPopup(map);

menu(map, naturlanLayer, naturschutzLayer, clusternlayer,clusternslayer,popupclose);

positionsuchen(map, vectorSorcepoly);






































