import { default as Animate, stop as Stop } from "animateplus";
import throttle from "lodash/throttle";

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

const animateIntro = async ({ intro }) => {
  const scrollingTitles = scroller(intro.rollingTitles, 3000, 130);

  window.onresize = throttle(
    () => {
      scrollingTitles.stop();
      scrollingTitles.start();
    },
    100,
    { trailing: true }
  );

  await Animate({
    easing: "linear",
    delay: 600,
    duration: 1500,
    change: p => {
      intro.video.el.style.opacity = p;
    }
  });

  await Animate({
    elements: intro.bars,
    easing: "in-out-quintic",
    duration: 1500,
    transform: index => [`translate(${100 - index * 200}%)`, 0],
    opacity: [0, 1]
  });

  await Animate({
    elements: intro.video.shrink,
    duration: 100,
    opacity: [0, 1]
  });

  await scrollingTitles.start();
};

export default animateIntro;
