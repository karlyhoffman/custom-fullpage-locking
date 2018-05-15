(function ($, window, document, undefined) {

  'use strict';

  $(function () {

    var $window = $(window);
    var $document = $(document);
    var $navGoPrev = $(".go-prev");
    var $navGoNext = $(".go-next");
    var $slidesContainer = $(".slides-container");
    var $slidesHorizontalContainer = $(".slides-container-horizontal");
    var $slides = $(".slide");
    var $slidesHorizontal = $(".slide-horizontal");
    var $currentSlide = $slides.first();
    var $currentHorizontalSlide = $slidesHorizontal.first();

    var isAnimating = false;
    var isHorizontal = false;

    var pageHeight = $window.innerHeight();
    var pageWidth = $window.innerWidth();

    var keyCodes = { UP: 38, DOWN: 40 };

    // goToSlide($currentSlide);
    $window.on("resize", onResize).resize();
    $window.on("mousewheel DOMMouseScroll", onMouseWheel);
    $document.on("keydown", onKeyDown);
    $navGoPrev.on("click", goToPrevSlide);
    $navGoNext.on("click", goToNextSlide);

    function onKeyDown(event) {
      var PRESSED_KEY = event.keyCode;
      if (PRESSED_KEY == keyCodes.UP) {
        goToPrevSlide();
        event.preventDefault();
      } else if (PRESSED_KEY == keyCodes.DOWN) {
        goToNextSlide();
        event.preventDefault();
      }
    }

    // mobile swiping
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* left swipe */
            } else {
                /* right swipe */
            }
        } else {
            if ( yDiff > 0 ) {
                /* up swipe */
            } else {
                /* down swipe */
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };

    function onMouseWheel(event) {
      var delta =
        event.originalEvent.wheelDelta / 30 || -event.originalEvent.detail;
      if (delta < -1) {
        goToNextSlide();
      } else if (delta > 1) {
        goToPrevSlide();
      }
      event.preventDefault();
    }

    function goToPrevSlide() {
      if ($currentSlide.prev().length) {
        goToSlide($currentSlide.prev());
      }
    }

    function goToNextSlide() {
      if ($currentSlide.next().length) {
        goToSlide($currentSlide.next());
      }
    }

    function goToSlide($slide) {
      // If the slides are not changing and there's such a slide
      if (!isAnimating && $slide.length) {
        //setting animating flag to true
        isAnimating = true;
        $currentSlide = $slide;

        if (isHorizontal) {
          TweenLite.to($slidesHorizontalContainer, 0.7, {
            scrollTo: { x: pageWidth * $currentHorizontalSlide.next().index() },
            onComplete: onSlideChangeEnd,
            onCompleteScope: this
          });
        } else if (  $currentSlide.is( $slidesHorizontalContainer ) ) {
          isHorizontal = true;

          TweenLite.to($slidesContainer, 1, {
            scrollTo: { y: pageHeight * $currentSlide.index() },
            onComplete: onSlideChangeEnd,
            onCompleteScope: this
          });
        } else {
          isHorizontal = false;

          TweenLite.to($slidesContainer, 1, {
            scrollTo: { y: pageHeight * $currentSlide.index() },
            onComplete: onSlideChangeEnd,
            onCompleteScope: this
          });
        }

      }
    }

    function onSlideChangeEnd() {
      isAnimating = false;
    }

    function onResize(event) {
      var newPageWidth = $window.innerWidth();
      if (pageWidth !== newPageWidth) {
        pageWidth = newPageWidth;
        TweenLite.set([$slidesContainer, $slides], { width: pageWidth + "px" });
        TweenLite.set($slidesContainer, {
          scrollTo: { x: pageWidth * $currentSlide.index() }
        });
      }
    }






  });

})(jQuery, window, document);
