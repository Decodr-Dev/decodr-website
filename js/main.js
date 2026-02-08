/**
 * Decodr Website — Main JavaScript
 * Handles navigation, FAQ accordion, smooth scrolling, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initSmoothScroll();
  initNavHighlight();
  initScrollAnimations();
  initNavScrollEffect();
  initTiltEffect();
  initMorphingWords();
  initChipParallax();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.nav__mobile');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

/**
 * Smooth Scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Highlight active navigation link
 */
function initNavHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');

    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Scroll-triggered animations with Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(element => {
    observer.observe(element);
  });
}

/**
 * Navigation scroll effect — adds shadow when scrolled
 */
function initNavScrollEffect() {
  const nav = document.querySelector('.nav');

  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  const updateNav = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 3D Tilt Effect for hero image
 * Creates a subtle perspective shift on mouse movement
 */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (!tiltCards.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  tiltCards.forEach(card => {
    const inner = card.querySelector('.tilt-card__inner');
    const glare = card.querySelector('.tilt-card__glare');

    if (!inner) return;

    const maxTilt = 8; // Max tilt in degrees
    const maxGlareOpacity = 0.3;

    let bounds;
    let animationId;

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };

    const handleMouseMove = (e) => {
      if (!bounds) updateBounds();

      // Calculate mouse position relative to card center (0-1 range, centered)
      const mouseX = (e.clientX - bounds.left) / bounds.width;
      const mouseY = (e.clientY - bounds.top) / bounds.height;

      // Convert to -1 to 1 range, centered at 0
      const tiltX = (mouseY - 0.5) * 2;
      const tiltY = (mouseX - 0.5) * -2;

      // Apply transform with rotation
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => {
        inner.style.transform = `
          rotateX(${tiltX * maxTilt}deg) 
          rotateY(${tiltY * maxTilt}deg)
          translateZ(10px)
        `;

        // Update glare position
        if (glare) {
          const glareX = mouseX * 100;
          const glareY = mouseY * 100;
          glare.style.background = `
            radial-gradient(
              circle at ${glareX}% ${glareY}%,
              rgba(255, 255, 255, ${maxGlareOpacity}) 0%,
              rgba(255, 255, 255, 0) 60%
            )
          `;
        }
      });
    };

    const handleMouseEnter = () => {
      updateBounds();
      inner.style.transition = 'transform 0.1s ease-out';
    };

    const handleMouseLeave = () => {
      inner.style.transition = 'transform 0.4s ease-out';
      inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';

      if (glare) {
        glare.style.background = '';
      }
    };

    // Event listeners
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Update bounds on resize
    window.addEventListener('resize', updateBounds, { passive: true });
  });
}

/**
 * Morphing Words Effect
 * Cycles through words with a smooth fade animation
 */
function initMorphingWords() {
  const morphingElements = document.querySelectorAll('.morphing-word');

  if (!morphingElements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  morphingElements.forEach(element => {
    const wordsData = element.getAttribute('data-words');

    if (!wordsData) return;

    try {
      const words = JSON.parse(wordsData);

      if (!words.length) return;

      let currentIndex = 0;
      const interval = 2500; // Time between word changes (ms)
      const animationDuration = 300; // Fade duration (ms)

      const cycleWord = () => {
        // Fade out
        element.classList.add('fade-out');
        element.classList.remove('fade-in');

        setTimeout(() => {
          // Change word
          currentIndex = (currentIndex + 1) % words.length;
          element.textContent = words[currentIndex];

          // Fade in
          element.classList.remove('fade-out');
          element.classList.add('fade-in');
        }, animationDuration);
      };

      // Start the cycle after initial delay
      setTimeout(() => {
        setInterval(cycleWord, interval);
      }, interval);

      // Add initial state
      element.classList.add('fade-in');

    } catch (e) {
      console.warn('Morphing words: Invalid JSON data', e);
    }
  });
}

/**
 * Floating Chip Parallax Effect
 * Chips move subtly as mouse moves within hero section
 */
function initChipParallax() {
  const hero = document.querySelector('.hero');
  const chips = document.querySelectorAll('.floating-chip[data-speed]');

  if (!hero || !chips.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Only apply on desktop
  if (window.innerWidth < 1024) return;

  let animationId;
  let mouseX = 0;
  let mouseY = 0;

  // Track mouse position
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    // Normalize to -1 to 1 range from center
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  // Smooth animation loop
  function animate() {
    chips.forEach(chip => {
      const speed = parseFloat(chip.dataset.speed) || 0.02;
      const maxMove = 30; // Maximum pixels to move

      const x = mouseX * maxMove * speed * 100;
      const y = mouseY * maxMove * speed * 100;

      chip.style.transform = `translate(${x}px, ${y}px)`;
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Dot Grid Spotlight Effect
 * Creates an amber glow that follows the cursor over the dot grid
 */
function initDotSpotlight() {
  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero__dot-spotlight');

  if (!hero || !spotlight) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Only apply on desktop
  if (window.innerWidth < 1024) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlight.style.left = `${x}px`;
    spotlight.style.top = `${y}px`;
  }, { passive: true });
}
