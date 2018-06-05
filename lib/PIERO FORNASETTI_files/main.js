document.addEventListener("DOMContentLoaded", function() {

  console.log('running');

  let totalDelay = 0;

  const chatAnimation = {
    targets: '.bubble',
    scale: [0, 1],
    duration: 400,
    easing: 'easeInOutQuart',
    delay: function(el, i, l) {
      const customDelay = el.dataset.delay;

      const defaultDelay = 1000;

      totalDelay = customDelay ? totalDelay  + parseInt(customDelay) : totalDelay + defaultDelay;

      if (i === 0) totalDelay = 1000;

      return totalDelay;
    }
  }

  let completed = null;

  const animation = anime(chatAnimation);


  function c(...n) {
    console.log(...n);
  }

  animation.update = function(anim) {

    const currentCompleted = anim.animations.filter((a) => a.currentValue === 1).length;

    if (currentCompleted && currentCompleted !== completed) {
      completed = currentCompleted;
      const index = completed - 1;
      const lastComplete = anim.animatables[index].target;

      const box = lastComplete.getBoundingClientRect();

      // console.log('last completed is', anim.animatables[index].target, box, anim);

      if (box.bottom > window.innerHeight) {
        const windowTop = document.body.style.top ? parseFloat(document.body.style.top.match(/\d+/)[0]) : 0;
        const marginBottom = window.getComputedStyle(lastComplete).marginBottom ? parseFloat(window.getComputedStyle(lastComplete).marginBottom.match(/\d+/)[0]) : 0;

        c(typeof windowTop);
        // console.log(window.getComputedStyle(lastComplete).marginBottom);


        anime({
          targets: document.body,
          duration: 300,
          top: (box.bottom + windowTop + marginBottom - window.innerHeight) * -1,
          easing: 'easeInOutQuart'
        });
      }

      // pause the animation on the last item
      // c(anim.animatables.slice(-1)[0].target, lastComplete)
      if (lastComplete === anim.animatables.slice(-1)[0].target) {
        console.log('last one');
        animation.pause();

        setTimeout(
          () => {
            // animation.restart();
            document.body.style.top = null;
          },
          1000
        )
      }
    }
  }

});