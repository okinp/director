import {
  getElementsObject,
  setupEvents,
  lookForElementsInView
} from "src/utils";
import { setupSlider } from "src/slider";
import animateIntro from "src/animations";
import "src/assets";
import srraf from "srraf";

window.onload = () => {
  const nodes = getElementsObject();
  setupEvents(nodes);
  setupSlider(nodes, ".project-card > span", ".portfolio__slider");
  animateIntro(nodes);
  lookForElementsInView("[data-observe");
  const scroller = srraf(({ x, px, y, py, vh, pvh, vw, pvw }, timestamp) => {
    console.log(pvh, "--", vh, "--", vw, "--", px, "--", py, "--", y);
    let textOffset = -0.05 * (y - vh);
    let imageOffset = 0.15 * (y - 0.9 * vh);

    nodes.about.image.style.transform = `translate3D(0px, ${imageOffset}px, 0px)`;
    nodes.about.text.style.transform = `translate3D(0px, ${textOffset}px, 0px)`;
    nodes.about.more.style.transform = `translate3D(0px, ${textOffset}px, 0px)`;
  });
  scroller.update(); // check position
};

if (module.hot) {
  module.hot.accept();
}
