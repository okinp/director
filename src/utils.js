import { OldFilmFilter } from "@pixi/filter-old-film";
import { Application, Container, Loader, Sprite, Ticker } from "pixi.js";

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
  let id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 6);
  id = `img-${id}`;
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
  let canvases = document.querySelectorAll(selector);
  let pixiPromises = [...canvases].map(cnv => createPixiInstance(cnv));
  return Promise.all(pixiPromises);
};

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

export { pixify, filterParams, supportsPassive };
