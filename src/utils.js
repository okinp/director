import { OldFilmFilter } from "@pixi/filter-old-film";
import { Application, Container, Loader, Sprite, Ticker } from "pixi.js";

const filterParams = {
  noise: 0.23,
  scratchDensity: 3.67,
  noiseSize: 0.16,
  sepia: 0
};

const createPixiInstance = function(elem) {
  const app = new Application(elem.dataset.width, elem.dataset.height, {
    transparent: true,
    autoStart: false
  });
  let tkr = Ticker.shared;
  tkr.autoStart = false;
  tkr.stop();
  let rafId = null;
  function run(timestamp) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      console.log("return");
      return;
    }
    console.log("request");
    rafId = requestAnimationFrame(run);
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

export { pixify, filterParams };
