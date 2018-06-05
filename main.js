document.addEventListener("DOMContentLoaded", function() {

  let totalDelay = 0;
  const firstDelay = 1000;
  const popDuration = 400;
  const defaultDelayBetweenSlides = 3000;

  const container = document.querySelector('.container');

  const chatAnimation = {
    targets: '.bubble',
    scale: [0, 1],
    duration: popDuration,
    autoplay: true,
    easing: 'easeInOutQuart',
    delay: function(el, i, l) {

      if (i === 0) return firstDelay;

      const customDelay = el.dataset.delay;

      totalDelay = customDelay ? totalDelay  + parseInt(customDelay) : totalDelay + defaultDelayBetweenSlides;

      return totalDelay;
    }
  }

  const animation = anime(chatAnimation);


  let ran = null;
  let lastStarted = null;

  animation.update = function(anim) {


    const currentRunning = anim.animations.filter((a) => a.currentValue > 0).length;

    // If a new item is animating
    if (currentRunning && currentRunning !== ran) {

      // save the number of animations that have started running in total
      ran = currentRunning;
      const index = ran - 1;

      lastStarted = anim.animatables[index].target;

      const box = lastStarted.getBoundingClientRect();

      // animate content
      anime({
        targets: anim.animatables[index].target.querySelector('.content'),
        duration: 600,
        opacity: [0, 1],
        easing: 'easeOutCubic',
        delay:  popDuration + 50
      })

      // if content overflows, animate container
      if (box.right > window.innerWidth) {
        const windowTop = container.style.left ? parseFloat(container.style.left.match(/\d+/)[0]) : 0;
        const marginBottom = window.getComputedStyle(lastStarted).marginBottom ? parseFloat(window.getComputedStyle(lastStarted).marginBottom.match(/\d+/)[0]) : 0;
        anime({
          targets: container,
          duration: 300,
          left: (box.right + windowTop + marginBottom - window.innerWidth) * -1,
          easing: 'easeInOutQuart',
        });
      }
    }


    // When last animation finishes, wait a bit and restart
    if (currentRunning === anim.animations.length && anim.animations.slice(-1)[0].currentValue === 1) {
      animation.pause();
      setTimeout(
        () => {
          animation.restart();
          container.style.left = null;
        },
        // defaultDelayBetweenSlides - firstDelay
        2000
      )
    }

  }

});