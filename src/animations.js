import animate from "animateplus";

const params = new Map()
  .set("el", "div")
  .set("translateX", 200)
  .set("complete", () => animate(params.set("delay", 1000)));

animate(params);

const movieTitlesScroll =  (_elem, _delay) => {
  const elem = _elem;
  const delay = _delay;
  let height, parentHeight, ratio;

  function init(){
    height = elem.offsetHeight;
    parentHeight = elem.parentElement.offsetHeight;
    ratio = parentHeight / height;
  }
  function scroll(){
    animate({
      elements: elem,
      duration: 10000,
      easing: "linear",
      transform: ["translateY(100%)", `translateY(${(-ratio)*100}%)`],
    }).then( params => {
      setTimeout( scroll, delay )
    })
  }
  return { init, scroll };
}

export default movieTitlesScroll;