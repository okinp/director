import { OldFilmFilter } from "@pixi/filter-old-film";
import { Application, Container, Loader, Sprite, Ticker } from "pixi.js";
import Swiper from "swiper";
import animate from "animateplus";
import { getRandomId } from "src/utils";

const filterParams = {
  noise: 0.23,
  scratchDensity: 3.67,
  noiseSize: 0.16,
  sepia: 0.35
};

const createPixiInstance = function(elem) {
  const app = new Application(elem.dataset.width, elem.dataset.height, {
    transparent: true,
    autoStart: false,
    resizeTo: elem.parentElement
  });

  let tkr = Ticker.shared;
  tkr.autoStart = false;
  tkr.stop();
  let rafHandle = null;
  function run(timestamp) {
    if (rafHandle) {
      cancelAnimationFrame(rafHandle);
      return;
    }
    rafHandle = requestAnimationFrame(run);
    tkr.update(timestamp);
  }
  run(0);

  app.view.width = elem.dataset.width;
  app.view.height = elem.dataset.height;

  const container = new Container();
  container.filters = [new OldFilmFilter(filterParams, Math.random() / 5)];
  container.filters[0].enabled = true;

  app.stage.addChild(container);
  elem.parentNode.replaceChild(app.view, elem);

  const loader = new Loader();
  const id = `img-${getRandomId()}`;

  loader.add(id, elem.dataset.src);

  return new Promise((res, rej) => {
    loader.load(() => {
      const bgSprite = new Sprite(loader.resources[id].texture);
      bgSprite.width = app.view.width;
      bgSprite.height = app.view.height;
      bgSprite.x = 0;
      bgSprite.y = 0;
      container.addChild(bgSprite);
      res(app);
    });
  });
};

const pixify = function(selector) {
  let elements = document.querySelectorAll(selector);
  let pixiPromises = [...elements].map(element => createPixiInstance(element));
  return Promise.all(pixiPromises);
};

function setupSlider({ portfolio }, dataNodeSelector, sliderNodeSelector) {
  pixify(dataNodeSelector).then(pixiArray => {
    const swiper = new Swiper(sliderNodeSelector, {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 200,
      touchRatio: 1
    });

    const track = portfolio.counter.track;
    let current = 0;
    let previous = 0;
    let numSlides = portfolio.slides.length;

    portfolio.counter.stop.innerHTML = `0${numSlides}`;

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
    });

    swiper.on("transitionEnd", function() {
      if (current === previous) return;
      portfolio.counter.start.innerHTML = `0${current + 1}`;
      const currentPixiApp = pixiArray[current].stage.children[0].filters[0];
      const previousPixiApp = pixiArray[previous].stage.children[0].filters[0];

      const fadeFn = (pixiApp, progress) => {
        pixiApp.noise = progress * filterParams.noise;
        pixiApp.scratchDensity = progress * filterParams.scratchDensity;
        pixiApp.noiseSize = progress * filterParams.noiseSize;
        pixiApp.sepia = progress * filterParams.sepia;
      };

      const handleFilters = progress => {
        fadeFn(previousPixiApp, progress);
        fadeFn(currentPixiApp, 1 - progress);
      };

      animate({
        easing: "in-quintic",
        duration: 500,
        change: handleFilters
      });
    });
  });
}

export { setupSlider };
