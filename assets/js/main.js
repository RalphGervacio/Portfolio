$(document).ready(function () {
  'use strict';

  $('#musicInfoModal').modal('show');
  const preloader = $('#preloader');
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

  //===== Initialize AOS (Animate On Scroll) =====//
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // ===== Toggle Mobile Navigation Menu ===== //
  function mobileNavToggle() {
    const isActive = $('body').hasClass('mobile-nav-active');

    if (!isActive) {
      $('body').addClass('mobile-nav-active');
      $('.mobile-nav-toggle').removeClass('bi-folder2-open').addClass('bi-x-circle text-danger');

      // Animate mobile nav links with AOS
      $('#mobile-navmenu a').each(function (index) {
        const $this = $(this);
        setTimeout(() => {
          $this.addClass('aos-animate');
        }, index * 100);
      });
    } else {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle').removeClass('bi-x-circle text-danger').addClass('bi-folder2-open');
      $('#mobile-navmenu a').removeClass('aos-animate');
    }
  }

  // ===== Highlight active menu item on both desktop and mobile ===== //
  $('#navmenu a, #mobile-navmenu a').on('click', function () {
    $('#navmenu a, #mobile-navmenu a').removeClass('active');
    $(this).addClass('active');
  });

  $(window).on('load', aosInit);

  //===== Typing effect =====//
  const items = ["Java Developer", "Drone Pilot", "Photographer", "PC Technician"];
  const chars = "!@#$%^&*()_+=-<>?/|{}[]0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function animateHackerText($el, word, onComplete) {
    const letters = word.split('');
    let display = new Array(letters.length).fill('');
    let lockIndex = 0;

    const interval = setInterval(() => {
      for (let i = 0; i < letters.length; i++) {
        if (i < lockIndex) {
          display[i] = letters[i];
        } else {
          display[i] = chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      $el.text(display.join(''));

      lockIndex++;
      if (lockIndex > letters.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 70); // speed per letter lock
  }

  function cycleWords(index = 0) {
    const $el = $('#hackerTyped');
    const word = items[index];

    animateHackerText($el, word, () => {
      cycleWords((index + 1) % items.length);
    });
  }

  cycleWords();

  //===== Hacker Text Effect for AOS-triggered spans =====//
  const hackerChars = "!@#$%^&*()_+=-<>?/|{}[]0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function animateSpanHacker($el, text, done) {
    const letters = text.split('');
    let display = new Array(letters.length).fill('');
    let lockIndex = 0;

    const interval = setInterval(() => {
      for (let i = 0; i < letters.length; i++) {
        if (i < lockIndex) {
          display[i] = letters[i];
        } else {
          display[i] = hackerChars.charAt(Math.floor(Math.random() * hackerChars.length));
        }
      }
      $el.text(display.join(''));

      lockIndex++;
      if (lockIndex > letters.length) {
        clearInterval(interval);
        if (done) setTimeout(done, 300);
      }
    }, 40);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $el = $(entry.target);
        const original = $el.attr('data-original') || $el.text();
        $el.attr('data-original', original);
        $el.text('');
        animateSpanHacker($el, original);
      }
    });
  }, { threshold: 0.6 });

  $('.hacker-span').each(function () {
    observer.observe(this);
  });

  //===== Initialize PureCounter (counter animation) =====//
  new PureCounter();

  //===== Initialize GLightbox (lightbox image gallery) =====//
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  glightbox.on('open', () => {
    if (!music.paused) {
      music.pause();
      music.setAttribute('data-paused-by-lightbox', 'true');
      isPlaying = false;
      $('#toggle-music').html('<i class="bi bi-music-note-beamed"></i>');
      $('#toggle-music').attr('title', 'Turn On Background Music');
    }
  });

  glightbox.on('close', () => {
    if (music.getAttribute('data-paused-by-lightbox') === 'true') {
      music.play();
      music.removeAttribute('data-paused-by-lightbox');
      isPlaying = true;
      $('#toggle-music').html('<i class="bi bi-pause-circle-fill"></i>');
      $('#toggle-music').attr('title', 'Turn Off Background Music');
    }
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

  //===== Navmenu Scrollspy Highlight on Scroll =====//
  const navmenulinks = $('#navmenu a, #mobile-navmenu a');

  function navmenuScrollspy() {
    const scrollTop = $(window).scrollTop() + 200;

    // Remove active class from both li and a
    $('#navmenu li, #mobile-navmenu li').removeClass('active');
    $('#mobile-navmenu a').removeClass('active');

    navmenulinks.each(function () {
      const link = $(this);
      const target = $(link.attr('href'));

      if (target.length) {
        const top = target.offset().top;
        const bottom = top + target.outerHeight();

        if (scrollTop >= top && scrollTop < bottom) {
          // Highlight desktop nav (li)
          $('#navmenu a[href="' + link.attr('href') + '"]').closest('li').addClass('active');

          // Highlight mobile nav (a)
          $('#mobile-navmenu a[href="' + link.attr('href') + '"]').addClass('active');
        }
      }
    });
  }

  // Run scrollspy on scroll/resize/load
  $(window).on('scroll resize', navmenuScrollspy);
  $(window).on('load', function () {
    navmenuScrollspy();
    setTimeout(navmenuScrollspy, 1000); // fallback after layout shifts
  });

  //===== Reinitialize AOS for animations =====//
  AOS.init({
    once: false
  });

  //===== SWAL ALERT FOR CV =====//
  $('#downloadCV').on('click', function () {
    Swal.fire({
      title: '<span class="hacker-span" id="swalHackerTitle"></span>',
      text: "Do you want to download the CV now?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-dark-theme',
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
      showClass: {
        popup: 'animate__animated animate__flipInX'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      },
      didOpen: () => {
        animateHackerText($('#swalHackerTitle'), 'Are You Sure?', () => { });
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
          allowOutsideClick: false
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
            title: '<span class="hacker-span" id="swalSuccessTitle"></span>',
            text: 'Thank you for downloading my CV.',
            confirmButtonText: 'Close',
            customClass: {
              popup: 'swal-dark-theme',
              confirmButton: 'btn btn-success'
            },
            buttonsStyling: false,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            didOpen: () => {
              animateHackerText($('#swalSuccessTitle'), 'Thank You!', () => { });
            }
          });
        }, 1500);
      }
    });
  });

});
