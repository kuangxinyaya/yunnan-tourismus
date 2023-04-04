 import { GeoJSON } from "ol/format";
 import WFS from 'ol/format/WFS.js';
 import {
    and as andFilter,
    equalTo as equalToFilter,
    like as likeFilter,
  } from 'ol/format/filter.js';
  import { transformExtent } from 'ol/proj';


 //Position durch input und search-button
 export function positionsuchen(map, vectorSorcepoly){
    const input = document.getElementById('site-search');

    const suchen = document.getElementById('button');
    suchen.addEventListener('click', async function(){
        // suche im WFS
        const featureRequest = new WFS().writeGetFeature({
            srsName: 'EPSG:3857',
            featureNS: 'http://openstreemap.org',
            featurePrefix: 'osm',
            featureTypes: ['naturschutz','naturlandschaft'],
            outputFormat: 'application/json',
            filter: likeFilter('name', input.value),
        });

        const response = await fetch('http://localhost:8081/geoserver/yunnan/ows?service=WFS', {
            method: 'POST',
            body: new XMLSerializer().serializeToString(featureRequest),
        });
        const json = await response.json();
        const vectorpoly = new GeoJSON().readFeatures(json);

        if (vectorpoly.length > 0) {

            vectorSorcepoly.clear();
            vectorSorcepoly.addFeature(vectorpoly[0]);

            map.getView().fit(json.bbox, {
                maxZoom: 12,
            });
        } else {
            const response = await fetch ('https://nominatim.openstreetmap.org/search?format=geojson&q=' + input.value + '&polygon_geojson=1'); 
            const result = await response.json();
            if (result.features.length > 0 ){
                const transformedExtent = transformExtent(result.features[0].bbox , 'EPSG:4326', 'EPSG:3857');
                

                //Position als Poly zurük
                const vectorpoly = new GeoJSON({
                    dataProjection: "EPSG:4326",
                    featureProjection: "EPSG:3857",
                }).readFeature(result.features[0]);
                vectorSorcepoly.clear();
                vectorSorcepoly.addFeature(vectorpoly);

                map.getView().fit(transformedExtent);
            } else {
                alert("kein Ergebnis");
            }
        }
    });


    //Trigger Button Click on Enter
    input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
    }
    });
 }