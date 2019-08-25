import { default as Animate, stop as Stop } from "animateplus";

const scroller = function(elem, delayBetweenLoops, scrollingSpeed) {
  let height, parentHeight, heightRatio, initialOffset, finalOffset;
  let distanceToCover = 0;
  let stopped = true;
  let timeoutHandle = null;

  function update() {
    height = elem.scrollHeight;
    parentHeight = elem.parentElement.scrollHeight;
    distanceToCover = height + parentHeight;
    heightRatio = parentHeight / height;
    initialOffset = 100;
    finalOffset = -heightRatio * 100;
  }

  function play() {
    if (stopped) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
    Animate({
      elements: elem,
      easing: "linear",
      duration: (1000 * distanceToCover) / scrollingSpeed,
      loop: false,
      transform: ["translateY(100%)", finalOffset]
    }).then(() => {
      timeoutHandle = setTimeout(play, delayBetweenLoops);
    });
  }

  function start() {
    setTimeout(() => {
      stopped = false;
      update();
      play();
    }, 0);
  }

  function stop() {
    stopped = true;
    Stop(elem);
    elem.style.transform = "translateY(100%)";
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
  }

  return { start, stop, update };
};

export default scroller;
