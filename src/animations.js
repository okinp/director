// Including the  WebAnimations API polyfill
require("web-animations-js/web-animations-next.min");
require("web-animations-js/src/web-animations-bonus-cancel-events");
const scroller = function(elem, delayBetweenLoops) {
  let height, parentHeight, heightRatio, initialOffset, finalOffset;
  let animationParameters = null;
  let timingParameters = null;
  let keyframeEffect = null;
  let animator = null;
  let speed = 70; //  px/sec
  let distanceToCover = 0;
  function update() {
    if (animator) {
      animator.finish();
    }
    height = elem.scrollHeight;
    parentHeight = elem.parentElement.scrollHeight;
    distanceToCover = height + parentHeight;
    heightRatio = parentHeight / height;
    initialOffset = 100;
    finalOffset = -heightRatio * 100;
    console.log(
      `Offset: ${finalOffset}, parentHeight: ${parentHeight}, height: ${height}`
    );
    animationParameters = [
      {
        transform: `translate3D(0,100%, 0)`
      },
      {
        transform: `translate3D(0,${finalOffset}%, 0)`
      }
    ];
    timingParameters = {
      duration: (1000 * distanceToCover) / speed,
      iterations: 1
    };
    keyframeEffect = new KeyframeEffect(
      elem,
      animationParameters,
      timingParameters
    );

    animator = new Animation(keyframeEffect, document.timeline);
    animator.finished.then(() => {
      setTimeout(() => {
        animator.play();
      }, 3000);
    });
    // animator.onfinish = function() {
    //   animator.cancel();
    //   setTimeout(() => {
    //     animator.play();
    //   }, 3000);
    // };
    animator.play();
  }
  setTimeout(update, 0);
  return update;
};

export default scroller;
