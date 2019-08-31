import animate from "animateplus";
import { disableScroll, enableScroll } from "src/disableScroll";

let supportsPassive = (function() {
  // Test via a getter in the options object to see if the passive property is accessed
  let supports = false;
  try {
    let opts = Object.defineProperty({}, "passive", {
      get: function() {
        supports = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {}
  return supports ? { passive: true } : false;
})();

function getElementsObject() {
  return {
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
    about: {
      image: document.querySelector(".about > .content > img"),
      text: document.querySelector(".about__text"),
      more: document.querySelector(".about > .more")
    },
    scrollToTop: document.querySelector(".scroll-to-top")
  };
}

function setupEvents({ header, intro, portfolio, scrollToTop }) {
  window.onbeforeunload = function() {
    window.scrollTo(0, 0);
  };

  header.burger.addEventListener(
    "mousedown",
    evt => {
      header.burger.classList.toggle("is-open");
      header.navigation.classList.toggle("is-open");
      document.body.classList.toggle("fullscreen");
      if (header.burger.classList.contains("is-open")) {
        window.scrollTo(0, 0);
        disableScroll();
      } else {
        enableScroll();
      }
      return false;
    },
    supportsPassive
  );

  intro.video.expand.addEventListener("mousedown", evt => {
    intro.bars.forEach(b => b.classList.toggle("hide"));
    document.body.classList.toggle("fullscreen");
    window.scrollTo(0, 0);
    disableScroll();
  });

  intro.video.shrink.addEventListener("mousedown", evt => {
    intro.bars.forEach(b => b.classList.toggle("hide"));
    document.body.classList.toggle("fullscreen");
    enableScroll();
  });

  intro.scrollDownButton.addEventListener(
    "mousedown",
    evt => {
      const root = document.scrollingElement;
      const from = root.scrollTop;
      const { top } = portfolio.el.getBoundingClientRect();

      animate({
        easing: "in-quintic",
        duration: 500,
        change: progress => (root.scrollTop = from + progress * top)
      });
      return false;
    },
    supportsPassive
  );

  scrollToTop.addEventListener(
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

function lookForElementsInView(selector) {
  let cb = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log("In View");
      } else {
        console.log("Out of view");
      }
    });
  };

  let options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  };

  let observer = new IntersectionObserver(cb, options);
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

const getRandomId = function() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 6);
};

export {
  supportsPassive,
  getElementsObject,
  setupEvents,
  lookForElementsInView,
  getRandomId
};
