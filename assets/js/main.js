$(document).ready(function () {
  'use strict';

  $('#musicInfoModal').modal('show');
  const preloader = $('#preloader');
  const scrollTop = $('.scroll-top');
  const headerToggleBtn = $('.header-toggle');
  const music = $('#bg-music')[0];
  music.volume = 0.05;
  let isPlaying = false;

  //===== Toggle Background Music =====//
  $('#toggle-music').on('click', function () {
    if (isPlaying) {
      music.pause();
      $(this).html('<i class="bi bi-music-note-beamed"></i>');
      $(this).attr('title', 'Turn On Background Music');
    } else {
      music.play();
      $(this).html('<i class="bi bi-pause-circle-fill"></i>');
      $(this).attr('title', 'Turn Off Background Music');
    }
    isPlaying = !isPlaying;
  });

  //===== Toggle the header visibility on small screens =====//
  function headerToggle() {
    $('#header').toggleClass('header-show');
    headerToggleBtn.toggleClass('bi-list bi-x');
  }

  //===== Event listener for toggling header menu =====//
  headerToggleBtn.on('click', headerToggle);

  //===== Hide header menu on nav link click (mobile) =====//
  $('#navmenu a').on('click', function () {
    if ($('.header-show').length) {
      headerToggle();
    }
  });

  //===== Preloader =====//
  if (preloader.length) {
    $(window).on('load', function () {
      $('.typing-container').on('animationend', function (e) {
        if (e.originalEvent.animationName === 'typing') {
          $(this).addClass('done');
        }
      });

      setTimeout(function () {
        preloader.addClass('fade-out');

        setTimeout(function () {
          preloader.remove();

          // Show modal only once
          if (!sessionStorage.getItem('musicModalShown')) {
            sessionStorage.setItem('musicModalShown', 'true');
          }

          // Trigger music toggle if user clicks Yes
          $('#music-yes-btn').on('click', function () {
            $('#toggle-music').trigger('click');
          });

        }, 1000);
      }, 2500);
    });
  }

  //===== Show/hide scroll-to-top button =====//
  function toggleScrollTop() {
    if (scrollTop.length) {
      if ($(window).scrollTop() > 100) {
        scrollTop.addClass('active');
      } else {
        scrollTop.removeClass('active');
      }
    }
  }

  //===== Scroll to top on button click =====//
  scrollTop.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  $(window).on('load', toggleScrollTop);
  $(document).on('scroll', toggleScrollTop);

  //===== Initialize AOS (Animate On Scroll) =====//
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  //===== Toggle mobile navigation menu =====//
  function mobileNavToggle() {
    const isActive = $('body').hasClass('mobile-nav-active');

    if (!isActive) {
      $('body').addClass('mobile-nav-active');
      $('.mobile-nav-toggle').removeClass('bi-folder2-open').addClass('bi-x-circle text-danger');

      // Animate nav links with AOS when opened
      $('#navmenu a').each(function (index) {
        const $this = $(this);
        setTimeout(() => {
          $this.addClass('aos-animate');
        }, index * 100);
      });
    } else {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle').removeClass('bi-x-circle text-danger').addClass('bi-folder2-open');
      $('#navmenu a').removeClass('aos-animate');
    }
  }

  //===== Mobile nav toggle click event =====//
  $('.mobile-nav-toggle').on('click', mobileNavToggle);

  //===== Close mobile nav when a menu item is clicked =====//
  $('#navmenu a').on('click', function () {
    if ($('body').hasClass('mobile-nav-active')) {
      mobileNavToggle();
    }
  });

  $(window).on('load', aosInit);

  //===== Typing effect using Typed.js =====//
  const selectTyped = $('.typed');
  if (selectTyped.length) {
    let typed_strings = selectTyped.data('typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 20,
      backSpeed: 20,
      backDelay: 500
    });
  }

  //===== Initialize PureCounter (counter animation) =====//
  new PureCounter();

  //===== Initialize GLightbox (lightbox image gallery) =====//
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  //===== Initialize Isotope for filtering/sorting grid items =====//
  $('.isotope-layout').each(function () {
    const $this = $(this);
    let layout = $this.data('layout') || 'masonry';
    let filter = $this.data('default-filter') || '*';
    let sort = $this.data('sort') || 'original-order';

    let initIsotope;
    imagesLoaded($this.find('.isotope-container')[0], function () {
      initIsotope = new Isotope($this.find('.isotope-container')[0], {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    //===== Filter items on button click =====//
    $this.find('.isotope-filters li').on('click', function () {
      $this.find('.filter-active').removeClass('filter-active');
      $(this).addClass('filter-active');
      initIsotope.arrange({ filter: $(this).data('filter') });
      if (typeof aosInit === 'function') {
        aosInit();
      }
    });
  });

  //===== Initialize Swiper sliders (with optional custom pagination) =====//
  function initSwiper() {
    $('.init-swiper').each(function () {
      const config = JSON.parse($(this).find('.swiper-config').text().trim());

      if ($(this).hasClass('swiper-tab')) {
        initSwiperWithCustomPagination(this, config);
      } else {
        new Swiper(this, config);
      }
    });
  }

  $(window).on('load', initSwiper);

  //===== Smooth scroll to section from hash on page load =====//
  $(window).on('load', function () {
    if (window.location.hash) {
      const section = $(window.location.hash);
      if (section.length) {
        setTimeout(function () {
          const scrollMarginTop = parseInt(section.css('scroll-margin-top'));
          $('html, body').animate({
            scrollTop: section.offset().top - scrollMarginTop
          }, 'slow');
        }, 100);
      }
    }
  });

  const navmenulinks = $('.navmenu a');

  //===== Highlight nav menu links based on scroll position =====//
  function navmenuScrollspy() {
    const position = $(window).scrollTop() + 200;

    navmenulinks.each(function () {
      const link = $(this);
      const target = $(link.attr('href'));

      if (target.length) {
        if (
          position >= target.offset().top &&
          position <= target.offset().top + target.outerHeight()
        ) {
          $('.navmenu a.active').removeClass('active');
          link.addClass('active');
        } else {
          link.removeClass('active');
        }
      }
    });
  }

  //===== Close header menu if clicked outside =====//
  $(document).on('click', function (e) {
    if (
      !$(e.target).closest('#header, .header-toggle').length &&
      $('#header').hasClass('header-show')
    ) {
      headerToggle();
    }
  });

  $(window).on('load', navmenuScrollspy);
  $(document).on('scroll', navmenuScrollspy);

  //===== Reinitialize AOS for animations =====//
  AOS.init({
    once: false
  });

  //===== SWAL ALERT FOR CV =====//
  $('#downloadCV').on('click', function () {
    Swal.fire({
      title: 'Are You Sure?',
      text: "Do you want to download the CV now?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'btn btn-dark mx-2',
        cancelButton: 'btn btn-light'
      },
      buttonsStyling: false,
      showClass: {
        popup: 'animate__animated animate__flipInX'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const cvUrl = 'assets/resume/Gervacio-Ralph-Daria.pdf';

        Swal.fire({
          title: 'Downloading...',
          html: `
          <div class="spinner-container" style="display: flex; justify-content: center; align-items: center; height: 80px;">
            <div class="custom-spinner" style="width: 40px; height: 40px; border: 4px solid #999; border-top-color: #000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
          <p style="margin-top: 10px;">Please wait while the CV is being downloaded.</p>
        `,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
          }
        });

        const a = document.createElement('a');
        a.href = cvUrl;
        a.download = 'Gervacio-Ralph-Daria.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Thank You!',
            text: 'Thank you for downloading my CV.',
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-dark'
            },
            buttonsStyling: false,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        }, 1500);
      }
    });
  });

});
