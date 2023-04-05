import { WFS } from "ol/format";
import { GML } from "ol/format";


const formatWFS = new WFS();

const formatGML = new GML({
  features: 'http://localhost:8081/geoserver/yunnan',
  featureType: 'bearmarker',
  srsName: 'EPSG:3857',
  
})

const xs = new XMLSerializer();



export const transactWFS = async function(mode, feature){
    let node;

    if (mode === 'update') {
      node = formatWFS.writeTransaction(null, [feature], null, formatGML);
    } else if (mode === 'insert') {
      node = formatWFS.writeTransaction([feature], null, null, formatGML);
    } else if (mode === 'delete') {
      node = formatWFS.writeTransaction(null, null, [feature], formatGML);
    }
  
  const payload = xs.serializeToString(node);
  const response = await fetch ('http://localhost:8081/geoserver/yunnan/ows', {
    method: 'POST',
    body: payload

  })
  const text = await response.text();
}
