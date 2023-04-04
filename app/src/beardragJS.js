

import { Feature } from "ol";
import { LineString, Point, Polygon } from 'ol/geom.js';


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

        const onMouseUp = function (event) {
            console.log("addEventListener('mouseup)")

            const coordinate = map.getEventCoordinate(event);
            const iconFeature = new Feature({
                geometry: new Point(coordinate),
            });

            dragvectorSouce.addFeature(iconFeature);

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


    //trash remove
    // 1
    // function trashremove() {
    //     var trash = document.getElementById('box2');
    //     trash.droppable({
    //       drop: function(event, features) {
    //         for (let i = 0; i < features.draggable.length; i++) {
    //           features.draggable[i].remove();
    //         }
    //       }
    //     });
    //   };


    // 2
    // document.getElementById("box2").ondrop = function(evt){
    //     const trash = evt.dataTransfer.getData();
    //     if(trash) {
    //         const target = iconFeature;
    //         removeChild(target);
    //     }
    //     // document.ondragover = function(evt)
    // }


    // 3
    // function allowDrop(ev){
    //     ev.preventDefault();
    // }
    // function drag(ev){
    //     ev.dataTransfer.setData("dragvectorLayer",ev.target.id);
    // }
    // function drop(ev){
    //     ev.preventDefault();
    //     const data = ev.dataTransfer.getData(dragvectorLayer);
    //     const el = document.getElementById(data);
    //     el.parentNode.removeChild(el);
    // }


    // })

}