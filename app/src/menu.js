  //passende Markers für passende Layers
  export function menu(map, naturlanLayer, naturschutzLayer, popupclose){
  const all = document.getElementById('nav-item-all');
  const nl = document.getElementById('nav-item-nl');
  const ns = document.getElementById('nav-item-ns');
  const kl = document.getElementById('nav-item-kl');

  all.addEventListener('click', function(){
    naturlanLayer.setVisible(true);
    naturschutzLayer.setVisible(true);
    popupclose();
  
  });
 
  nl.addEventListener('click', function(){
    naturlanLayer.setVisible(true);
    naturschutzLayer.setVisible(false);
    popupclose();
  });

  ns.addEventListener('click', function(){
    naturschutzLayer.setVisible(true);
    naturlanLayer.setVisible(false);
    popupclose();
  });

  kl.addEventListener('click', function(){
    naturschutzLayer.setVisible(false);
    naturlanLayer.setVisible(false);
    popupclose();
  });
}
