

import { Feature } from "ol";
import { LineString, Point, Polygon } from 'ol/geom.js';
import { transactWFS } from "./transaction";


export function bear(map, dragvectorSouce) {
    let currentDroppable = null;


    box1.addEventListener('mousedown', function (event) {

        let shiftX = event.clientX - box1.getBoundingClientRect().left;
        let shiftY = event.clientY - box1.getBoundingClientRect().top;

        box1.style.position = 'absolute';
        box1.style.zIndex = 1000;
        document.body.append(box1);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            box1.style.left = pageX - shiftX + 'px';
            box1.style.top = pageY - shiftY + 'px';
        }



        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            box1.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            box1.hidden = false;

            // if (!elemBelow) return;

            // let droppableBelow = elemBelow.closest('.box');
            // if (currentDroppable != droppableBelow) {
            //     if (currentDroppable) {
            //         leaveDroppable(currentDroppable);
            //     }
            //     currentDroppable = droppableBelow;
            //     if (currentDroppable) {
            //         enterDroppable(currentDroppable);
            //     }
            // }
        }

        document.addEventListener('mousemove', onMouseMove);

        const onMouseUp = async function (event) {
            console.log("addEventListener('mouseup)")

            const coordinate = map.getEventCoordinate(event);
            const iconFeature = new Feature({
                geometry: new Point(coordinate),
            });

            dragvectorSouce.addFeature(iconFeature);
            await transactWFS('insert',iconFeature);
            dragvectorSouce.refresh();

            document.removeEventListener('mousemove', onMouseMove);
            box1.removeEventListener('mouseup', onMouseUp);

            box1.style.left = "19.5em";
            box1.style.top = "5.5em";
        };

        box1.addEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseup', onMouseMove);

    });

    // function enterDroppable(elem) {
    //     elem.style.background = 'rgb(245, 235, 235) ';
    // }

    // function leaveDroppable(elem) {
    //     elem.style.background = '';
    // }

    box1.ondragstart = function () {
        return false;
    };


}