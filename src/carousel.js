import { default as Hammer } from "hammerjs";


function carousel(node){
  let numSlides = [...node.children].length;
  let sliderManager = new Hammer.Manager(node);
  sliderManager.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
  sliderManager.on('pan', function(e) {
    var percentage = 100 / numSlides * e.deltaX / node.clientWidth; // NEW: our % calc
    // debugger;
    node.style.transform = 'translateX(' + percentage + '%)'; // NEW: our CSS transform
    console.log(e);
  });
}

export default carousel;