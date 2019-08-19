import animate from "animateplus";
import throttle from "lodash/throttle";
import Swiper from "swiper";
import { disableScroll, enableScroll } from "src/disableScroll";
import { pixify, observeChanges, filterParams } from "src/utils";
import movieTitlesScroll from "src/animations";

import "css/main-entry";
import "fonts/icomoon/style";
import "images/logo.svg";
import "images/video-screenshot.jpg";
import "images/project1.jpg";
import "images/project2.jpg";
import "images/project3.jpg";
import "images/cv.jpg";
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

pixify(".project-card > span ")
  .then(pixiArray => {
    pixiApps = pixiArray;
    const swiper = new Swiper(".portfolio__slider", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 200
    });

    let track = el.portfolio.counter.track;
    let slideIndex = 1;
    let numSlides = el.portfolio.slides.length;

    el.portfolio.counter.stop.innerHTML = `0${numSlides}`;
    const movingFilterParams = filterParams;
    const finsihedFilterParams = {
      noise: 0,
      scratchDensity: 0,
      sepia: 0,
      noiseSize: 0
    };
    swiper.on("progress", a => {
      slideIndex = a * (numSlides - 1) + 1;
      let width = track.clientWidth;
      let gradientStop = (100 * (1 + (numSlides - 1) * a)) / numSlides;
      track.style = ` background: linear-gradient(to right, #fbee30 ${gradientStop}%, #3b3b3b ${gradientStop}%);
                      width: ${width}px;
                      height: 1px;`;
      filterParams.noise = 0.65;
      filterParams.scratchDensity = 0.3;
      filterParams.sepia = 0.2;
      filterParams.noiseSize = 0.2;
    });

    swiper.on("transitionEnd", () => {
      slideIndex = Math.ceil(slideIndex);
      el.portfolio.counter.start.innerHTML = `0${slideIndex}`;
      filterParams.noise = 0;
      filterParams.scratchDensity = 0;
      filterParams.sepia = 0;
      filterParams.noiseSize = 0;
    });
  })
  .then(() => {
    observeChanges(".portfolio__track", mutation => {
      if (mutation.oldValue.includes("swiper-slide-active")) {
        console.log("Remove: ", mutation);
      } else if (
        !mutation.oldValue.includes("swiper-slide-active") &&
        mutation.target.classList.contains("swiper-slide-active")
      ) {
        console.log("Add: ", mutation);
      }
    });
  });

if (module.hot) {
  module.hot.accept();
}
