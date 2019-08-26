import animate from "animateplus";
import throttle from "lodash/throttle";
import Swiper from "swiper";
import { disableScroll, enableScroll } from "src/disableScroll";
import { pixify, filterParams, supportsPassive } from "src/utils";
import scroller from "src/animations";

import "css/main-entry";
import "fonts/icomoon/style";
import "images/logo.svg";
import "images/video-screenshot.jpg";
import "images/project1.jpg";
import "images/project2.jpg";
import "images/project3.jpg";
import "images/cv.jpg";
import "images/social-instagram.svg";
import "images/social-facebook.svg";
import "images/social-linkedin.svg";
import "images/social-vimeo.svg";
import "images/social-imdb.svg";
import "images/arrow-up.svg";
import "images/cursor.svg.png";
import "images/cursor-drag.svg.png";

let scrollingTitles = null;
let el = null;

function getElementsObject() {
  el = {
    body: document.querySelector("body"),
    header: {
      el: document.querySelector("header"),
      burger: document.querySelector(".burger-button"),
      navigation: document.querySelector("nav")
    },
    intro: {
      el: document.querySelector(".intro"),
      video: {
        shrink: document.querySelector(".close-expanded-video"),
        expand: document.querySelector(".expand"),
        el: document.querySelector(".intro > .content > img")
      },
      bars: [...document.querySelectorAll(".bar")],
      rollingTitles: document.querySelector(".video-text-scroll"),
      scrollDownButton: document.querySelector(".scroll-down")
    },
    portfolio: {
      el: document.querySelector(".portfolio"),
      counter: {
        start: document.querySelector(".counter__start"),
        stop: document.querySelector(".counter__stop"),
        track: document.querySelector(".counter__track")
      },
      slides: [...document.querySelectorAll(".portfolio__item")]
    },
    scrollToTop: document.querySelector(".scroll-to-top")
  };
}

function setupEvents() {
  //

  window.onbeforeunload = function() {
    window.scrollTo(0, 0);
  };

  window.onresize = throttle(
    () => {
      scrollingTitles.stop();
      scrollingTitles.start();
    },
    100,
    { trailing: true }
  );

  el.header.burger.addEventListener(
    "mousedown",
    evt => {
      el.header.burger.classList.toggle("is-open");
      el.header.navigation.classList.toggle("is-open");
      el.body.classList.toggle("fullscreen");
      if (el.header.burger.classList.contains("is-open")) {
        window.scrollTo(0, 0);
        disableScroll();
      } else {
        enableScroll();
      }
      return false;
    },
    supportsPassive
  );

  el.intro.video.expand.addEventListener("mousedown", evt => {
    el.intro.bars.forEach(b => b.classList.toggle("hide"));
    el.body.classList.toggle("fullscreen");
    window.scrollTo(0, 0);
    disableScroll();
  });

  el.intro.video.shrink.addEventListener("mousedown", evt => {
    el.intro.bars.forEach(b => b.classList.toggle("hide"));
    el.body.classList.toggle("fullscreen");
    enableScroll();
  });

  el.intro.scrollDownButton.addEventListener(
    "mousedown",
    evt => {
      const root = document.scrollingElement;
      const from = root.scrollTop;
      const { top } = el.portfolio.el.getBoundingClientRect();

      animate({
        easing: "in-quintic",
        duration: 500,
        change: progress => (root.scrollTop = from + progress * top)
      });
      return false;
    },
    supportsPassive
  );

  el.scrollToTop.addEventListener(
    "mousedown",
    evt => {
      const root = document.scrollingElement;
      const from = root.scrollTop;
      animate({
        easing: "in-quintic",
        duration: 500,
        change: progress => (root.scrollTop = from * (1 - progress))
      });
      return false;
    },
    supportsPassive
  );
}

function setupCarousel() {
  pixify(".project-card > span ").then(pixiArray => {
    const swiper = new Swiper(".portfolio__slider", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 200,
      touchRatio: 1
    });

    const track = el.portfolio.counter.track;
    let current = 0;
    let previous = 0;
    let numSlides = el.portfolio.slides.length;

    el.portfolio.counter.stop.innerHTML = `0${numSlides}`;

    // set filtering params to 0 for initial slide
    pixiArray[0].stage.children[0].filters[0].noise = 0;
    pixiArray[0].stage.children[0].filters[0].scratchDensity = 0;
    pixiArray[0].stage.children[0].filters[0].noiseSize = 0;
    pixiArray[0].stage.children[0].filters[0].sepia = 0;

    swiper.on("progress", a => {
      let width = track.clientWidth;
      let gradientStop = (100 * (1 + (numSlides - 1) * a)) / numSlides;
      track.style = ` background: linear-gradient(to right, #fbee30 ${gradientStop}%, #3b3b3b ${gradientStop}%);
                    width: ${width}px;
                    height: 1px;`;
    });

    swiper.on("transitionStart", function() {
      previous = current;
      current = this.activeIndex;
      console.log("transition start: ", current, " ", previous);
    });

    swiper.on("transitionEnd", function() {
      if (current === previous) return;
      console.log("transition end: ", current, " ", previous);
      el.portfolio.counter.start.innerHTML = `0${current + 1}`;
      const currentPixiApp = pixiArray[current].stage.children[0].filters[0];
      const previousPixiApp = pixiArray[previous].stage.children[0].filters[0];

      const fadeOutFn = progress => {
        currentPixiApp.noise = (1 - progress) * filterParams.noise;
        currentPixiApp.scratchDensity =
          (1 - progress) * filterParams.scratchDensity;
        currentPixiApp.noiseSize = (1 - progress) * filterParams.noiseSize;
        currentPixiApp.sepia = (1 - progress) * filterParams.sepia;
      };

      const fadeInFn = progress => {
        previousPixiApp.noise = progress * filterParams.noise;
        previousPixiApp.scratchDensity = progress * filterParams.scratchDensity;
        previousPixiApp.noiseSize = progress * filterParams.noiseSize;
        previousPixiApp.sepia = progress * filterParams.sepia;
      };

      const handleFilters = progress => {
        fadeOutFn(progress);
        fadeInFn(progress);
      };

      animate({
        easing: "in-quintic",
        duration: 500,
        change: handleFilters
      });
    });
  });
}

const animateIntro = async () => {
  scrollingTitles = scroller(el.intro.rollingTitles, 3000, 130);

  await animate({
    easing: "linear",
    delay: 600,
    duration: 1000,
    change: p => {
      el.intro.video.el.style.opacity = p;
    }
  });

  await animate({
    elements: el.intro.bars,
    easing: "in-out-quintic",
    duration: 1500,
    transform: index => [`translate(${100 - index * 200}%)`, 0],
    opacity: [0, 1]
  });

  await animate({
    elements: el.intro.video.shrink,
    duration: 100,
    opacity: [0, 1]
  });

  await scrollingTitles.start();
};

window.onload = () => {
  getElementsObject();
  animateIntro();
  setupEvents();
  setupCarousel();
};

if (module.hot) {
  module.hot.accept();
}
