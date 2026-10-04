document.addEventListener('DOMContentLoaded', () => {
  // Dynamic Year
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Sticky Navbar Scroll Compression
  const headerGallery = document.querySelector('.header-gallery');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerGallery?.classList.add('scrolled');
    } else {
      headerGallery?.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.hero-grid, .spotlight-grid, .gallery-card, .specialist-card, .before-after-container, .hero-stats');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animated Statistics Counter
  const countElements = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.getAttribute('data-count'), 10);
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target > 1000 ? 50 : 20;
        const increment = Math.ceil(target / 40);

        const counter = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(counter);
          }
          entry.target.textContent = count.toLocaleString() + suffix;
        }, speed);
      }
    });
  }, { threshold: 0.5 });

  countElements.forEach(el => countObserver.observe(el));

  // Protocol Modal Explorer
  const openProtocolBtns = document.querySelectorAll('.open-protocol');
  const protocolModal = document.getElementById('protocolModal');

  if (openProtocolBtns.length > 0 && protocolModal) {
    openProtocolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = btn.getAttribute('data-title') || '';
        document.getElementById('modalCode').textContent = btn.getAttribute('data-code') || '';
        document.getElementById('modalCategory').textContent = btn.getAttribute('data-cat') || '';
        document.getElementById('modalDowntime').textContent = btn.getAttribute('data-downtime') || '';
        document.getElementById('modalSessions').textContent = btn.getAttribute('data-sessions') || '';
        document.getElementById('modalLead').textContent = btn.getAttribute('data-lead') || '';

        protocolModal.classList.add('active');
      });
    });
  }

  // Gallery Overlay Navigation Toggle
  const menuTrigger = document.querySelector('.menu-trigger');
  const closeTrigger = document.querySelector('.close-trigger');
  const galleryOverlay = document.querySelector('.gallery-overlay');

  if (menuTrigger && galleryOverlay) {
    menuTrigger.addEventListener('click', () => {
      galleryOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeTrigger && galleryOverlay) {
    closeTrigger.addEventListener('click', () => {
      galleryOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close overlay/modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (galleryOverlay && galleryOverlay.classList.contains('active')) {
        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (protocolModal && protocolModal.classList.contains('active')) {
        protocolModal.classList.remove('active');
      }
    }
  });

  // Interactive Before / After Clinical Sliders
  const baContainers = document.querySelectorAll('.before-after-container');

  baContainers.forEach(container => {
    const beforeImage = container.querySelector('.ba-before');
    const handle = container.querySelector('.ba-slider-handle');

    if (!beforeImage || !handle) return;

    const updateSliderWidth = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      if (width > 0) {
        container.style.setProperty('--ba-width', `${width}px`);
        const beforeImg = beforeImage.querySelector('img');
        if (beforeImg) {
          beforeImg.style.width = `${width}px`;
          beforeImg.style.minWidth = `${width}px`;
          beforeImg.style.maxWidth = `${width}px`;
        }
      }
    };

    updateSliderWidth();
    window.addEventListener('resize', updateSliderWidth);

    container.querySelectorAll('img').forEach(img => {
      if (img.complete) {
        updateSliderWidth();
      } else {
        img.addEventListener('load', updateSliderWidth);
      }
    });

    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      beforeImage.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const stopDrag = () => {
      isDragging = false;
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      moveSlider(clientX);
    };

    handle.addEventListener('mousedown', startDrag);
    container.addEventListener('mousedown', (e) => {
      moveSlider(e.clientX);
      startDrag(e);
    });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', onDrag);

    handle.addEventListener('touchstart', startDrag, { passive: true });
    container.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        moveSlider(e.touches[0].clientX);
      }
      startDrag(e);
    }, { passive: true });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', onDrag);
  });

  // Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});
