document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');
  const faqItems = document.querySelectorAll('.faq-item');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const yearSpan = document.getElementById('year');

  // Year setup
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     Theme Management (Dark & Light)
     ========================================================================== */
  const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      if (themeIcon) themeIcon.innerHTML = sunSvg;
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (themeIcon) themeIcon.innerHTML = moonSvg;
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('site-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (systemPrefersDark) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('site-theme', nextTheme);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('site-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  initTheme();

  /* ==========================================================================
     Mobile Navigation Toggle
     ========================================================================== */
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     Scrollspy for Header Navigation Active State
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     FAQ Accordion Toggle (CoreMate Style)
     ========================================================================== */
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: close other accordions
        faqItems.forEach((other) => {
          if (other !== item) other.classList.remove('active');
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     Contact Form Submission Simulation
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>문의 접수 중...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        if (formFeedback) {
          formFeedback.textContent = '교육 문의가 정상적으로 접수되었습니다. 24시간 이내에 강의 제안서 및 견적을 회신드리겠습니다.';
          formFeedback.className = 'form-feedback success';

          setTimeout(() => {
            formFeedback.textContent = '';
          }, 6000);
        }
      }, 700);
    });
  }

  /* ==========================================================================
     Case Field Single Scene Slider (Carousel)
     ========================================================================== */
  const caseTrack = document.getElementById('case-slider-track');
  const caseSlides = document.querySelectorAll('.case-slide-item');
  const prevBtns = [document.getElementById('case-prev-btn'), document.getElementById('case-side-prev')];
  const nextBtns = [document.getElementById('case-next-btn'), document.getElementById('case-side-next')];
  const currentNumEl = document.getElementById('case-current-num');
  const totalNumEl = document.getElementById('case-total-num');
  const dotBtns = document.querySelectorAll('.case-dot-btn');
  const categoryPills = document.querySelectorAll('#case-category-tabs .field-tag-pill');

  let currentSlideIndex = 0;
  const totalSlidesCount = caseSlides.length;

  if (totalNumEl && totalSlidesCount > 0) {
    totalNumEl.textContent = String(totalSlidesCount).padStart(2, '0');
  }

  function updateSlider(index) {
    if (!caseTrack || totalSlidesCount === 0) return;

    // Normalize index with looping
    if (index < 0) {
      currentSlideIndex = totalSlidesCount - 1;
    } else if (index >= totalSlidesCount) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }

    // Move track smoothly
    caseTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Update Counter Number
    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    // Update Bottom Dots
    dotBtns.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });

    // Update Top Category Pills
    categoryPills.forEach((pill) => {
      const targetIdx = parseInt(pill.getAttribute('data-slide-index'), 10);
      pill.classList.toggle('active', targetIdx === currentSlideIndex);
    });
  }

  // Prev / Next Button Listeners
  prevBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        updateSlider(currentSlideIndex - 1);
      });
    }
  });

  nextBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        updateSlider(currentSlideIndex + 1);
      });
    }
  });

  // Dots Listeners
  dotBtns.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide-index'), 10);
      updateSlider(targetIdx);
    });
  });

  // Category Pills Listeners
  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetIdx = parseInt(pill.getAttribute('data-slide-index'), 10);
      updateSlider(targetIdx);
    });
  });

  // Touch Swipe for Mobile
  const sliderViewport = document.getElementById('case-slider-viewport');
  if (sliderViewport) {
    let startX = 0;
    let endX = 0;

    sliderViewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    sliderViewport.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          // Swiped Left -> Next Slide
          updateSlider(currentSlideIndex + 1);
        } else {
          // Swiped Right -> Prev Slide
          updateSlider(currentSlideIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Keyboard Navigation when cases section is in view
  window.addEventListener('keydown', (e) => {
    const casesSection = document.getElementById('cases');
    if (!casesSection) return;

    const rect = casesSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      if (e.key === 'ArrowLeft') {
        updateSlider(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateSlider(currentSlideIndex + 1);
      }
    }
  });
});
