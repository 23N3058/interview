gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const animationConfig = {
  duration: isMobile ? 0.3 : 0.5,
  scrubDuration: isMobile ? 0.5 : 1,
  endPosition: isMobile ? '+=800' : '+=1200'
};

const setupLazyLoading = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[src]').forEach(img => {
    img.dataset.src = img.src;
    img.src = '';
    imageObserver.observe(img);
  });
};

const sections = gsap.utils.toArray("section");

sections.forEach(section => {
  const image = section.querySelector(".img");
  const interviewImage = section.querySelector(".interview-image");
  const qaPairs = section.querySelectorAll(".qa-pair");
        
  gsap.set([image, interviewImage, ...qaPairs], {
    willChange: 'transform, opacity'
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      anticipatePin: 1,
      scrub: animationConfig.scrubDuration,
      start: "top top",
      end: animationConfig.endPosition,
      onEnter: () => {
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      },
      onLeave: () => {
        section.removeAttribute('tabindex');
      }
    }
  });
  
  gsap.set(interviewImage, {
    opacity: 0,
    x: isMobile ? 0 : -30,
    y: isMobile ? 30 : 0
  });
  
  if (prefersReducedMotion.matches) {
    tl.to(image, { scale: 1, duration: 0.1 })
      .to(interviewImage, { opacity: 1, duration: 0.1 })
      .to(qaPairs, { opacity: 1, duration: 0.1 });
  } else {
    tl.to(image, {
      scale: 1,
      duration: animationConfig.duration,
      ease: "power2.inOut"
    })
    .to(interviewImage, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: animationConfig.duration,
      ease: "power2.out"
    }, "-=0.5")
    
    qaPairs.forEach((pair, index) => {
      tl.to(pair, {
        opacity: 1,
        y: 0,
        duration: animationConfig.duration,
        ease: "power2.out"
      }, `-=${index > 0 ? 0.3 : 0}`);
    });

    [...qaPairs].reverse().forEach((pair, index) => {
      tl.to(pair, {
        opacity: 0,
        y: -30,
        duration: animationConfig.duration * 0.6,
        ease: "power2.in"
      }, `-=${index > 0 ? 0.2 : 0}`);
    });

    tl.to(interviewImage, {
      opacity: 0,
      x: isMobile ? 0 : -30,
      y: isMobile ? -30 : 0,
      duration: animationConfig.duration * 0.6,
      ease: "power2.in"
    }, "-=0.3");
  }
});

const titleAnimation = gsap.timeline({
  defaults: { 
    duration: prefersReducedMotion.matches ? 0.5 : 2,
    ease: "power4.out"
  }
});

titleAnimation
  .fromTo(
    ".title",
    { opacity: 0, scale: 0.5, y: -50, rotateX: 45 },
    { opacity: 1, scale: 1, y: 0, rotateX: 0 }
  )
  .fromTo(
    ".subtitle",
    { opacity: 0, y: 50, scale: 0.5 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 1.5,
      delay: 0
    }
  );

document.addEventListener('DOMContentLoaded', () => {
  setupLazyLoading();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  window.addEventListener('error', (e) => {
    console.error('Animation error:', e);
    sections.forEach(section => {
      gsap.set([
        section.querySelector(".img"),
        section.querySelector(".interview-image"),
        ...section.querySelectorAll(".qa-pair")
      ], { opacity: 1, scale: 1, y: 0, x: 0 });
    });
  });
});