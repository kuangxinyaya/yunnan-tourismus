import { Overlay } from "ol";
import VectorLayer from "ol/layer/Vector";
import {boundingExtent} from 'ol/extent';
import { apply } from "ol/transform";


export function setupPopup(map) {
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
    popupclose();
    return false;
  };

  function popupclose() {
    popup.setPosition(undefined);
    closer.blur();
  }

 
    map.on('click', function (event) {
      const features = map.getFeaturesAtPixel(event.pixel, {
        layerFilter: function (layer) {
          if (layer.get("name") === "Cluster Layer" || layer.get("name") === "Cluster Layernl") {
            return true;
          }
          else {
            return false;
          }
        }
      });
      
      if (features && features.length > 0) {
        const feature = features[0];

        const clusteredFeatures = feature.get('features');

        if (clusteredFeatures && clusteredFeatures.length > 1) {
          const extent = boundingExtent(
            clusteredFeatures.map((r) => r.getGeometry().getCoordinates())
          );
          map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});

        } else if (clusteredFeatures && clusteredFeatures.length > 0) {

          const ele = document.getElementById('popuptext');
          ele.innerHTML = clusteredFeatures[0].get("name");

          const bilder = clusteredFeatures[0].get('bilder');
          const img1 = document.getElementById('img1');
          img1.setAttribute("src", bilder);

          const intro = document.getElementById('intro11');
          intro.innerHTML = clusteredFeatures[0].get("intro");

          const like = document.getElementById('like');
          like.innerHTML = clusteredFeatures[0].get('like');
          
          const progress = clusteredFeatures[0].get('progress');
          const prog = document.getElementById('pro1');
          if (progress){
            prog.setAttribute("value", progress);

          } else {
            prog.style.display = "none";
      
          }
         

          const coordinates = clusteredFeatures[0].getGeometry().getCoordinates();
          popup.setPosition(coordinates);

        }
      };
      });
  

  return popupclose;
}

