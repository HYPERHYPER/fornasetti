document.addEventListener("DOMContentLoaded", function() {

  document.querySelector('.fullscreen').addEventListener('click', (e) => {
    if (screenfull.enabled) {
      screenfull.toggle();
    } else {
      videoPlayer.webkitEnterFullScreen();
    }

    e.target.style.display = 'none';
  })


  let totalDelay = 0;
  const firstDelay = 9000;
  const popDuration = 800;
  const defaultDelayBetweenSlides = 8000;
  const coverDuration = 8000;

  const coverAnimation = {
    targets: '#cover .slide',
    translateX: -781,
    duration: coverDuration,
    easing: 'linear',
    elasticity: 0,

  }

  const cover = anime(coverAnimation)
  
  cover.complete = function(anim) {
      anime({
        targets: '#cover',
        duration: 800,
        opacity: [1, 0],
        easing: 'easeInOutQuart',
      });
  }


  const container = document.querySelector('.container');

  const chatAnimation = {
    targets: '.bubble',
    scale: [0, 1],
    duration: popDuration,
    autoplay: true,
    easing: 'easeInOutQuart',
    delay: function(el, i, l) {

      const customDelay = el.dataset.delay;

      totalDelay = customDelay ? totalDelay + parseInt(customDelay) : totalDelay + defaultDelayBetweenSlides;

      if (i === 0) totalDelay = firstDelay;

      return totalDelay;
    }
  }


  const animation = anime(chatAnimation);



  let ran = null;
  let lastStarted = null;
  let coverVisible = true;
  animation.update = function(anim) {


    const currentRunning = anim.animations.filter((a) => a.currentValue > 0).length;


    // If a new item is animating
    if (currentRunning && currentRunning !== ran) {

      if(coverVisible) console.log("cover");

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
          anime({
            targets: '#cover',
            duration: 2000,
            opacity: [0, 1],
            easing: 'easeInOutQuart',
          });
          cover.restart();
          animation.restart();
          container.style.left = null;
        },
        defaultDelayBetweenSlides
      )
    }

  }

});