$(document).ready(function () {
  // ===============================
  // HEADER / NAVIGATION BEHAVIOR
  // ===============================

  $('.navbar-nav li a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  $(".navbar-toggler").click(function () {
    $("body").toggleClass("no-scroll");
  });

  $(".header-menu a").click(function () {
    $("body").removeClass("no-scroll");
  });

  $('.header-btn-main a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });



  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
      $(".header-main").addClass("active");
    } else {
      $(".header-main").removeClass("active");
    }
  });

  // ===============================
  // THEME TOGGLE
  // ===============================
  $(".theme-btn-main .theme-change").click(function () {
    $("html").toggleClass("body-theme");
  });

  // ===============================
  // VERTICAL SLICK SLIDER INIT
  // ===============================
  function initVerticalSlider() {
    const $slider = $('.vertical-slider');

    // Initialize Slick only if not already initialized
    if ($slider.length && !$slider.hasClass('slick-initialized')) {
      $slider.slick({
        dots: true,
        arrows: false,
        autoplay: true,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 100,

        customPaging: function (slider, i) {
          return '<span class="dot"></span>';
        },

        responsive: [
          {
            breakpoint: 1200,
            settings: { slidesToShow: 1 },
          },
          {
            breakpoint: 991,
            settings: { slidesToShow: 1 },
          },
          {
            breakpoint: 768,
            settings: { slidesToShow: 1 },
          },
        ],
      });
    }

    // Remove old scroll/touch handlers (to avoid duplicates)
    $(window).off('wheel.verticalSlider touchstart.verticalSlider touchend.verticalSlider');

    if ($slider.length) {
      let touchStartY = 0;
      let touchEndY = 0;

      // Mouse wheel scroll with namespace
      $(window).on('wheel.verticalSlider', function (e) {
        const sliderTop = $slider.offset().top;
        const sliderBottom = sliderTop + $slider.outerHeight();
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();

        if (sliderTop < scrollTop + windowHeight && sliderBottom > scrollTop) {
          if (e.originalEvent.deltaY < 0) {
            $slider.slick('slickPrev');
          } else {
            $slider.slick('slickNext');
          }
        }
      });

      // Touch swipe support
      $(window).on('touchstart.verticalSlider', function (e) {
        touchStartY = e.originalEvent.touches[0].clientY;
      });

      $(window).on('touchend.verticalSlider', function (e) {
        touchEndY = e.originalEvent.changedTouches[0].clientY;

        const sliderTop = $slider.offset().top;
        const sliderBottom = sliderTop + $slider.outerHeight();
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();

        if (sliderTop < scrollTop + windowHeight && sliderBottom > scrollTop) {
          if (touchStartY - touchEndY > 50) {
            $slider.slick('slickNext');
          } else if (touchEndY - touchStartY > 50) {
            $slider.slick('slickPrev');
          }
        }
      });
    }
  }

  // First page load
  initVerticalSlider();

  // SPA/React re-init using custom event
  window.addEventListener("reInitSlider", initVerticalSlider);


          // accordion article detail page
  


});
