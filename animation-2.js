function verticalLoop(wrapper, config) {
  const items = gsap.utils.toArray(
    wrapper.querySelectorAll(".hero-main_images_item")
  );
  if (!items.length) return;

  config = config || {};

  const isReverse = wrapper.classList.contains("is-riverse");

  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startY = items[0].offsetTop,
    times = [],
    heights = [],
    yPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalHeight,
    curY,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  gsap.set(items, {
    yPercent: (i, el) => {
      let h = (heights[i] = parseFloat(gsap.getProperty(el, "height", "px")));
      yPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "y", "px")) / h) * 100 +
          gsap.getProperty(el, "yPercent")
      );
      return yPercents[i];
    },
  });
  gsap.set(items, { y: 0 });

  totalHeight =
    items[length - 1].offsetTop +
    (yPercents[length - 1] / 100) * heights[length - 1] -
    startY +
    items[length - 1].offsetHeight *
      gsap.getProperty(items[length - 1], "scaleY") +
    (parseFloat(config.paddingBottom) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curY = (yPercents[i] / 100) * heights[i];
    distanceToStart = item.offsetTop + curY - startY;
    distanceToLoop =
      distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");

    tl.to(
      item,
      {
        yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          yPercent: snap(
            ((curY - distanceToLoop + totalHeight) / heights[i]) * 100
          ),
        },
        {
          yPercent: yPercents[i],
          duration:
            (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;

  tl.progress(1, true).progress(0, true);

  if (isReverse || config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }

  return tl;
}

window.addEventListener("DOMContentLoaded", function () {
  const wrappers = document.querySelectorAll(".hero-main_images_list");
  const isDesktop = window.innerWidth >= 1024;

  wrappers.forEach((wrapper) => {
    const isReverse = wrapper.classList.contains("is-riverse");

    let tl = verticalLoop(wrapper, {
      speed: 1,
      repeat: -1,
      paused: false,
      paddingBottom: 16,
      reversed: isReverse,
    });

    if (isReverse) {
      tl.timeScale(-1);
    }

    if (isDesktop) {
      const proxy = document.createElement("div");
      gsap.set(proxy, { y: 0 });

      Draggable.create(proxy, {
        type: "y",
        trigger: wrapper,
        inertia: true,
        onDrag: updateProgress,
        onThrowUpdate: updateProgress,
        onRelease: () => {
          tl.play();
        },
        onDragStart: () => {
          tl.pause();
        },
      });

      function updateProgress() {
        const rect = wrapper.getBoundingClientRect();
        const relativeY = this.y / rect.height;
        const newTime = tl.duration() * gsap.utils.wrap(0, 1, 0.5 - relativeY);

        tl.time(newTime);
      }

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();

          const direction = isReverse ? -self.direction : self.direction;

          tl.timeScale(
            gsap.utils.clamp(0.2, 5, Math.abs(velocity / 300)) *
              (direction === 1 ? 1 : -1)
          );
        },
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.play(),
      });
    }
  });
});

function horizontalLoop(wrapper, config) {
  // const items = gsap.utils.toArray(
  //   wrapper.querySelectorAll(".service_slider_item")
  // );
  const items = gsap.utils.toArray(
    wrapper.querySelectorAll("[data-horizontal-loop='item']")
  );

  if (!items.length) return;

  config = config || {};
  // const isReverse = wrapper.classList.contains("is-riverse");
  const isReverse = wrapper.classList.contains("data-reverse");

  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  // Reset inline transforms before measuring
  gsap.set(items, { x: 0, xPercent: 0 });

  // Correctly measure widths and set xPercent
  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;

  tl.progress(1, true).progress(0, true);

  if (isReverse || config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }

  return tl;
}

window.addEventListener("DOMContentLoaded", () => {
  // const wrappers = document.querySelectorAll(".services_slider_list");
  const wrappers = document.querySelectorAll(
    "[data-horizontal-loop='wrapper']"
  );

  wrappers.forEach((wrapper) => {
    // const isReverse = wrapper.classList.contains("is-riverse");
    const isReverse = wrapper.classList.contains("data-reverse");
    const speed = parseFloat(wrapper.getAttribute("data-speed")) || 1;

    let tl = horizontalLoop(wrapper, {
      speed: speed,
      snap: 1,
      repeat: -1,
      paused: false,
      paddingRight: 16,
    });

    if (isReverse) {
      tl.timeScale(-1);
    }

    const proxy = document.createElement("div");
    gsap.set(proxy, { x: 0 });

    Draggable.create(proxy, {
      type: "x",
      trigger: wrapper,
      inertia: true,
      onDrag: updateProgress,
      onThrowUpdate: updateProgress,
      onRelease: () => {
        tl.play();
      },
      onDragStart() {
        tl.pause();
      },
    });

    function updateProgress() {
      const rect = wrapper.getBoundingClientRect();
      const relativeX = this.x / rect.width;
      const newTime =
        tl.duration() * gsap.utils.wrap(0, 1, 0.5 - relativeX / 2);

      tl.time(newTime);
    }

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();

        const direction = isReverse ? -self.direction : self.direction;

        tl.timeScale(
          gsap.utils.clamp(0.2, 5, Math.abs(velocity / 300)) *
            (direction === 1 ? 1 : -1)
        );
      },
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
    });
  });
});

/// Design And Development Hero
window.addEventListener("DOMContentLoaded", () => {
  // const wrappers = document.querySelectorAll(".services_slider_list");
  const desktop = window.innerWidth >= 992;
  if (!desktop) return;

  const wrappers = document.querySelectorAll(".design-hero_marquee_list");

  wrappers.forEach((wrapper) => {
    // const isReverse = wrapper.classList.contains("is-riverse");
    const isReverse = wrapper.classList.contains("data-reverse");
    const speed = parseFloat(wrapper.getAttribute("data-speed")) || 1;

    let tl = horizontalLoop(wrapper, {
      speed: speed,
      snap: 1,
      repeat: -1,
      paused: false,
      paddingRight: 16,
    });

    if (isReverse) {
      tl.timeScale(-1);
    }

    const proxy = document.createElement("div");
    gsap.set(proxy, { x: 0 });

    Draggable.create(proxy, {
      type: "x",
      trigger: wrapper,
      inertia: true,
      onDrag: updateProgress,
      onThrowUpdate: updateProgress,
      onRelease: () => {
        tl.play();
      },
      onDragStart() {
        tl.pause();
      },
    });

    function updateProgress() {
      const rect = wrapper.getBoundingClientRect();
      const relativeX = this.x / rect.width;
      const newTime =
        tl.duration() * gsap.utils.wrap(0, 1, 0.5 - relativeX / 2);

      tl.time(newTime);
    }

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();

        const direction = isReverse ? -self.direction : self.direction;

        tl.timeScale(
          gsap.utils.clamp(0.2, 5, Math.abs(velocity / 300)) *
            (direction === 1 ? 1 : -1)
        );
      },
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
    });
  });
});

// Design and Development Artist Section
window.addEventListener("DOMContentLoaded", () => {
  const mobileScreen = window.innerWidth <= 794;
  const wrappers = document.querySelectorAll(".artist_list");

  wrappers.forEach((wrapper) => {
    const isReverse = wrapper.classList.contains("data-reverse");
    const speed = parseFloat(wrapper.getAttribute("data-speed")) || 1;

    const dragSensitivity = 10;

    let tl = horizontalLoop(wrapper, {
      speed: speed,
      repeat: -1,
      paddingRight: 16,
    });

    if (isReverse) {
      tl.timeScale(-1);
    }

    let playTween = gsap.to(tl, {
      time: tl.duration(),
      duration: tl.duration(),
      ease: "none",
      repeat: -1,
      paused: false,
      onRepeat: () => {
        if (isReverse) {
          tl.timeScale(-1);
        }
      },
    });

    // Observer drag
    Observer.create({
      target: wrapper,
      type: "wheel,touch,pointer",
      onPress: () => {
        playTween.pause();
        gsap.killTweensOf(tl);
      },
      onDrag: (self) => {
        const rect = wrapper.getBoundingClientRect();
        const progressDelta = mobileScreen
          ? self.deltaX / (rect.width * 4)
          : self.deltaX / (rect.width * 2);
        // const progressDelta = self.deltaX / (rect.width * 2);
        const newTime = tl.time() - progressDelta * tl.duration();
        tl.time(gsap.utils.wrap(0, tl.duration(), newTime));
      },
      onRelease: () => {
        playTween.play();
      },
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => playTween.pause(),
      onEnterBack: () => playTween.play(),
    });
  });
});

function servicesHorizontalLoop(wrapper, config) {
  const serviceSection = document.querySelector(".services_wrap");
  if (!serviceSection) return;
  const items = gsap.utils.toArray(
    wrapper.querySelectorAll("[data-horizontal-loop='item']")
  );

  if (!items.length) return;

  config = config || {};
  const isReverse = wrapper.classList.contains("data-reverse");

  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;

  // Reset inline transforms before measuring
  gsap.set(items, { x: 0, xPercent: 0 });

  // Correctly measure widths and set xPercent
  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;

  tl.progress(1, true).progress(0, true);

  if (isReverse || config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }

  return tl;
}

// ====== GLOBAL STATE MANAGEMENT ======
let servicesSwiper = null;
let gsapInstances = [];

// ====== CLEANUP FUNCTIONS ======
function cleanupSwiper() {
  if (servicesSwiper) {
    servicesSwiper.destroy(true, true);
    servicesSwiper = null;
  }
}

function cleanupGSAP() {
  gsapInstances.forEach((instance) => {
    if (instance.timeline) {
      instance.timeline.kill();
    }
    if (instance.draggable) {
      instance.draggable.kill();
    }
    if (instance.scrollTrigger) {
      instance.scrollTrigger.kill();
    }
    if (instance.eventListeners) {
      instance.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }
  });
  gsapInstances = [];

  // Clean up all ScrollTriggers
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}

// ====== INITIALIZATION FUNCTION ======
function initializeServicesSlider() {
  // Clean up existing instances
  cleanupSwiper();
  // cleanupGSAP();

  if (window.innerWidth < 992) {
    // ====== MOBILE: SWIPER IMPLEMENTATION ======
    servicesSwiper = new Swiper("[data-swiper-content='services']", {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      pagination: {
        el: ".services_pagination",
        clickable: true,
      },
    });
  } else {
    // ====== DESKTOP: GSAP IMPLEMENTATION ======
    const wrappers = document.querySelectorAll(
      "[data-horizontal-loop='service']"
    );

    wrappers.forEach((wrapper) => {
      const isReverse = wrapper.classList.contains("data-reverse");
      const speed = parseFloat(wrapper.getAttribute("data-speed")) || 1;

      let tl = servicesHorizontalLoop(wrapper, {
        speed: speed,
        snap: 1,
        repeat: -1,
        paused: false,
        paddingRight: 16,
      });

      if (isReverse) {
        tl.timeScale(-1);
      }

      // ====== NAVIGATION CONTROLS INTEGRATION ======
      const servicesContainer = wrapper.closest(".services_content_wrap");
      const prevBtn = servicesContainer?.querySelector(
        '[data-service-control="prev-btn"]'
      );
      const nextBtn = servicesContainer?.querySelector(
        '[data-service-control="next-btn"]'
      );

      // Navigation state management
      let isNavigating = false;
      let wasPlaying = false;

      // Event handlers (stored for cleanup)
      const eventListeners = [];

      // Previous button functionality
      const handlePrevClick = () => {
        if (isNavigating) return;

        isNavigating = true;
        wasPlaying = !tl.paused();

        tl.pause();

        tl.previous({
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            isNavigating = false;
            if (wasPlaying) {
              setTimeout(() => tl.play(), 500);
            }
          },
        });
      };

      // Next button functionality
      const handleNextClick = () => {
        if (isNavigating) return;

        isNavigating = true;
        wasPlaying = !tl.paused();

        tl.pause();

        tl.next({
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            isNavigating = false;
            if (wasPlaying) {
              setTimeout(() => tl.play(), 500);
            }
          },
        });
      };

      // Add event listeners and store references
      if (prevBtn) {
        prevBtn.addEventListener("click", handlePrevClick);
        eventListeners.push({
          element: prevBtn,
          event: "click",
          handler: handlePrevClick,
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", handleNextClick);
        eventListeners.push({
          element: nextBtn,
          event: "click",
          handler: handleNextClick,
        });
      }

      // ====== DRAG FUNCTIONALITY ======
      const proxy = document.createElement("div");
      gsap.set(proxy, { x: 0 });

      const draggableInstance = Draggable.create(proxy, {
        type: "x",
        trigger: wrapper,
        inertia: true,
        onDrag: updateProgress,
        onThrowUpdate: updateProgress,
        onRelease: () => {
          if (!isNavigating) {
            tl.play();
          }
        },
        onDragStart() {
          if (!isNavigating) {
            tl.pause();
          }
        },
      })[0];

      function updateProgress() {
        if (isNavigating) return;

        const rect = wrapper.getBoundingClientRect();
        const relativeX = this.x / rect.width;
        const newTime =
          tl.duration() * gsap.utils.wrap(0, 1, 0.5 - relativeX / 2);

        tl.time(newTime);
      }

      // ====== SCROLL TRIGGER ======
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (isNavigating) return;

          const velocity = self.getVelocity();
          const direction = isReverse ? -self.direction : self.direction;

          tl.timeScale(
            gsap.utils.clamp(0.2, 5, Math.abs(velocity / 300)) *
              (direction === 1 ? 1 : -1)
          );
        },
        onLeave: () => {
          if (!isNavigating) tl.pause();
        },
        onEnterBack: () => {
          if (!isNavigating) tl.play();
        },
      });

      // Store instance for cleanup
      gsapInstances.push({
        timeline: tl,
        draggable: draggableInstance,
        scrollTrigger: scrollTriggerInstance,
        eventListeners: eventListeners,
      });
    });
  }
}

// ====== RESIZE HANDLER WITH DEBOUNCING ======
let resizeTimeout;
const RESIZE_DEBOUNCE_DELAY = 250; // milliseconds

function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    console.log("Services slider: Handling resize event");
    initializeServicesSlider();
  }, RESIZE_DEBOUNCE_DELAY);
}

// ====== EVENT LISTENERS ======
window.addEventListener("DOMContentLoaded", () => {
  console.log("Services slider: DOM loaded, initializing...");
  initializeServicesSlider();
});

window.addEventListener("resize", handleResize);

// ====== OPTIONAL: ORIENTATION CHANGE SUPPORT ======
window.addEventListener("orientationchange", () => {
  // Small delay to allow device to complete orientation change
  setTimeout(() => {
    console.log("Services slider: Orientation changed, reinitializing...");
    initializeServicesSlider();
  }, 300);
});

// ====== CLEANUP ON PAGE UNLOAD ======
window.addEventListener("beforeunload", () => {
  cleanupSwiper();
  cleanupGSAP();
});

const architectAnimation = () => {
  const text = document.querySelector("#text1 textPath");
  const tl = gsap.timeline({ repeat: -1 });

  tl.from(text, {
    duration: 60,
    ease: "none",
    attr: { startOffset: "-100%" },
  });
};

architectAnimation();

function changeColorOnView() {
  const texts = document.querySelectorAll('[data-text-animation="color"]');
  const images = document.querySelectorAll(".impact_image");

  ScrollTrigger.config({ ignoreMobileResize: true });

  // Initialize all images hidden
  gsap.set(images, {
    opacity: 0,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // width: "100%",
    // height: "100vh",
  });

  texts.forEach((text, index) => {
    gsap.to(text, {
      scrollTrigger: {
        trigger: text,
        start: "top center",
        end: "bottom center",
        invalidateOnRefresh: true,
        // markers: true,
        toggleClass: { targets: text, className: "active" },
        onEnter: () => setActiveImage(index),
        onEnterBack: () => setActiveImage(index),
      },
    });
  });

  function setActiveImage(activeIndex) {
    images.forEach((img, i) => {
      if (i === activeIndex) {
        gsap.to(img, { opacity: 1, duration: 0.6, overwrite: "auto" });
      } else {
        gsap.to(img, { opacity: 0, duration: 0.6, overwrite: "auto" });
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", function () {
  changeColorOnView();
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

function countToNumber(element, target, duration = 2000) {
  const start = 0;
  const range = target - start;
  const frameRate = 30; // update setiap ~33ms
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let currentFrame = 0;

  // Tentukan jumlah desimal dari target
  const decimals = (target.toString().split(".")[1] || "").length;

  console.log("run");

  const counter = setInterval(() => {
    currentFrame++;
    const progress = currentFrame / totalFrames;
    const currentNumber = start + range * progress;

    element.textContent = Number(currentNumber).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (currentFrame >= totalFrames) {
      clearInterval(counter);
      element.textContent = Number(target).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      element.removeAttribute("data-scrumble-animation");
    }
  }, 1000 / frameRate);
}

window.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll('[data-scrumble-animation="number"]')
    .forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        // markers: true,
        onEnter: () => {
          const target = parseFloat(el.getAttribute("data-target"), 10);
          countToNumber(el, target);
        },
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector(".slider-text_list");
  const items = gsap.utils.toArray(".slider-text_item");
  if (!list || !items) return;

  const itemHeight = items[0].offsetHeight;

  function slideNext() {
    gsap.to(list, {
      y: -itemHeight,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        // ambil item pertama
        const firstItem = list.children[0];
        // pindahkan ke bawah
        list.appendChild(firstItem);
        // reset posisi list ke 0 (tanpa animasi)
        gsap.set(list, { y: 0 });
      },
    });
  }

  // jalankan interval (tiap 2.5 detik)
  setInterval(slideNext, 2500);
});

// Navbar Cross Light Section
document.addEventListener("DOMContentLoaded", () => {
  // Select the navbar
  const navbar = document.querySelector('[data-element="navbar"]');

  if (!navbar) return;

  // Select all light background sections
  const lightSections = document.querySelectorAll(".u-theme-light");

  if (!lightSections.length) return;

  // Function to check precise intersection between navbar and light sections
  function updateNavbarClass() {
    // if (window.innerWidth < 991) return;
    // Get navbar position data
    const navRect = navbar.getBoundingClientRect();
    const navbarBottom = navRect.bottom;
    const navbarTop = navRect.top;

    // Flag to track if navbar is currently over any light section
    let isOverLightSection = false;

    // Check each light section
    lightSections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();

      // Check if navbar overlaps with this light section
      // Navbar is considered "in" the section when its middle point is inside the section
      const navbarMiddle = navbarTop + navRect.height / 2;

      if (
        navbarMiddle >= sectionRect.top &&
        navbarMiddle <= sectionRect.bottom
      ) {
        isOverLightSection = true;
      }
    });

    // Add or remove class based on precise intersection
    if (isOverLightSection) {
      navbar.classList.add("is-dark");
    } else {
      navbar.classList.remove("is-dark");
    }
  }

  // Initial check
  updateNavbarClass();

  // Add scroll event listener with throttling for performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbarClass();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Also update on resize
  window.addEventListener("resize", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbarClass();
        ticking = false;
      });
      ticking = true;
    }
  });
});

// BOOK animation
class BookInteraction {
  constructor() {
    this.wrapper = document.querySelector('[data-book-open="wrapper"]');
    this.closeBtn = document.querySelector('[data-book="close-btn"]');
    this.currentPanel = null;
    this.isDesktop = false;

    this.init();
  }

  init() {
    this.checkDevice();
    this.bindEvents();
    this.handleResize();
  }

  checkDevice() {
    this.isDesktop = window.innerWidth >= 768;
  }

  bindEvents() {
    // Handle book page clicks (data-book-close) - Desktop only
    document.addEventListener("click", (e) => {
      if (!this.isDesktop) return;

      const bookClose = e.target.closest("[data-book-close]");

      if (bookClose) {
        e.preventDefault();
        const pageNumber = bookClose.getAttribute("data-book-close");
        this.openPanel(pageNumber);
        return;
      }
    });

    // Handle close button click - Desktop only
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", (e) => {
        if (!this.isDesktop) return;

        e.stopPropagation();
        this.closePanel();
      });
    }

    // Handle outside click - Desktop only
    if (this.wrapper) {
      this.wrapper.addEventListener("click", (e) => {
        if (!this.isDesktop) return;

        if (e.target === this.wrapper) {
          this.closePanel();
        }
      });
    }

    // Handle escape key - Desktop only
    document.addEventListener("keydown", (e) => {
      if (!this.isDesktop) return;

      if (e.key === "Escape" && this.currentPanel) {
        this.closePanel();
      }
    });
  }

  handleResize() {
    window.addEventListener("resize", () => {
      const wasDesktop = this.isDesktop;
      this.checkDevice();

      // If switching from desktop to mobile, close any open panels
      if (wasDesktop && !this.isDesktop && this.currentPanel) {
        this.closePanel();
      }
    });
  }

  openPanel(pageNumber) {
    if (!this.isDesktop) return;

    // Close any currently open panel first
    this.closePanel();

    // Find the target panel
    const targetPanel = document.querySelector(
      `[data-book-open="${pageNumber}"]`
    );

    if (!targetPanel || !this.wrapper) return;

    // Show wrapper and target panel
    this.wrapper.classList.add("active");
    targetPanel.classList.add("active");

    // Store current panel reference
    this.currentPanel = targetPanel;
  }

  closePanel() {
    if (!this.wrapper || !this.currentPanel) return;

    // Hide wrapper and current panel
    this.wrapper.classList.remove("active");
    this.currentPanel.classList.remove("active");

    // Clear current panel reference
    this.currentPanel = null;
  }
}

// Initialize when DOM is ready - with device check
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if desktop
  if (window.innerWidth >= 768) {
    new BookInteraction();
  }
});
