import animate from "animateplus";
import throttle from "lodash/throttle";
import Swiper from "swiper";
import { disableScroll, enableScroll } from "src/disableScroll";
import { pixify, filterParams } from "src/utils";
import movieTitlesScroll from "src/animations";
import * as PIXI from "pixi.js";
import { TweenMax } from "gsap/TweenMax";
import { ScrollToPlugin, PixiPlugin } from "gsap/all";
const gsapPlugins = [PixiPlugin, ScrollToPlugin];

import "css/main-entry";
import "fonts/icomoon/style";
import "images/logo.svg";
import "images/video-screenshot.jpg";
import "images/project1.jpg";
import "images/project2.jpg";
import "images/project3.jpg";
import "images/cv.jpg";

gsapPlugins[0].registerPIXI(PIXI);

//
const el = {
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
      expand: document.querySelector(".expand")
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
  }
};

window.scrollTo(0, 0);
let titleScroller = movieTitlesScroll(el.intro.rollingTitles, 5000);
titleScroller.init();
titleScroller.scroll();

let x = 0;

window.onresize = throttle(
  () => {
    titleScroller.init();
  },
  300,
  { trailing: true }
);

el.header.burger.addEventListener("mousedown", evt => {
  el.header.burger.classList.toggle("is-open");
  el.header.navigation.classList.toggle("is-open");
  el.body.classList.toggle("fullscreen");
  if (el.header.burger.classList.contains("is-open")) {
    window.scrollTo(0, 0);
    disableScroll();
  } else {
    enableScroll();
  }
});

Object.values(el.intro.video).forEach(control =>
  control.addEventListener("mousedown", evt => {
    el.intro.bars.forEach(b => b.classList.toggle("hide"));
    el.body.classList.toggle("fullscreen");
    if (el.intro.bars[0].classList.contains("hide")) {
      window.scrollTo(0, 0);
      disableScroll();
    } else {
      enableScroll();
    }
  })
);

el.intro.scrollDownButton.addEventListener("mousedown", evt => {
  const root = document.scrollingElement;
  const from = root.scrollTop;
  const { top } = el.portfolio.el.getBoundingClientRect();
  animate({
    easing: "in-quintic",
    duration: 500,
    change: progress => (root.scrollTop = from + progress * top)
  });
  evt.preventDefault();
});

let pixiApps = null;

pixify(".project-card > span ").then(pixiArray => {
  pixiApps = pixiArray;
  const swiper = new Swiper(".portfolio__slider", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 200
  });

  // TweenMax.to(pixiApps[0].stage.children[0].filters, 0.2, [
  //   disabledRGBSplitFilterParams,
  //   disabledOldFilmFilterParams
  // ]);

  let track = el.portfolio.counter.track;
  let slideIndex = 1;
  let current = 0;
  let previous = 0;
  let numSlides = el.portfolio.slides.length;

  let initFilter = pixiApps[0].stage.children[0].filters[0];
  initFilter.noise = 0;
  initFilter.scratchDensity = 0;
  initFilter.noiseSize = 0;

  el.portfolio.counter.stop.innerHTML = `0${numSlides}`;
  const movingFilterParams = filterParams;

  const disabledOldFilmFilterParams = {
    noise: 0,
    scratchDensity: 0,
    noiseSize: 0
  };

  const enabledOldFilmFilterParams = {
    noise: 0.23,
    scratchDensity: 3.67,
    noiseSize: 0.16,
    sepia: 0
  };

  const disabledRGBSplitFilterParams = {
    blue: [0, 0],
    green: [0, 0],
    red: [0, 0]
  };

  const enabledRGBSplitFilterParams = {
    blue: [0, 0],
    green: [0, 10],
    red: [-10, 0]
  };

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
  });

  swiper.on("transitionEnd", function() {
    console.log("after: ", current);
    el.portfolio.counter.start.innerHTML = `0${current + 1}`;

    TweenMax.to(
      pixiApps[current].stage.children[0].filters[0],
      2,
      disabledOldFilmFilterParams
    );

    TweenMax.to(pixiApps[previous].stage.children[0].filters[0], 2, {
      ...enabledOldFilmFilterParams,
      seed: Math.random()
    });
  });
});

if (module.hot) {
  module.hot.accept();
}
