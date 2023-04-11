//passende Markers für passende Layers
export function menu(map, naturlanLayer, naturschutzLayer, clusternlayer, clusternslayer, popupclose) {
  const all = document.getElementById('nav-item-all');
  const nl = document.getElementById('nav-item-nl');
  const ns = document.getElementById('nav-item-ns');
  const kl = document.getElementById('nav-item-kl');

  all.addEventListener('click', function () {
    naturlanLayer.setVisible(true);
    naturschutzLayer.setVisible(true);
    clusternslayer.setVisible(true);
    clusternlayer.setVisible(true);
    popupclose();

  });

  nl.addEventListener('click', function () {
    naturlanLayer.setVisible(true);
    naturschutzLayer.setVisible(false);
    clusternslayer.setVisible(false);
    clusternlayer.setVisible(true);
    popupclose();
  });

  ns.addEventListener('click', function () {
    naturschutzLayer.setVisible(true);
    naturlanLayer.setVisible(false);
    clusternslayer.setVisible(true);
    clusternlayer.setVisible(false);
    popupclose();
  });

  kl.addEventListener('click', function () {
    naturschutzLayer.setVisible(false);
    naturlanLayer.setVisible(false);
    clusternslayer.setVisible(false);
    clusternlayer.setVisible(false);
    popupclose();
  });

  const activli = document.getElementsByTagName('li');
  let i, j;
  const length = activli.length;
  for (i = 0; i < length; i++) {
    activli[i].onclick = function () {
      for (j = 0; j < length; j++) {
        activli[j].className = "";
      }
      this.className += "clickstyle";
    }
  }

}

