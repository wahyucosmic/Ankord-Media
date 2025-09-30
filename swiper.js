document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper.is-services", {
    slidesPerView: "auto",
    spaceBetween: 16,
    navigation: {
      nextEl: ".swiper-control.is-next",
      prevEl: ".swiper-control.is-prev",
    },
  });
});

function elevatedSwiper() {
  const elevatedContentSwiper = new Swiper(".swiper.is-elevated-content", {
    slidesPerView: 1,
    direction: "horizontal",
    breakpoints: {
      992: {
        slidesPerView: 1,
        direction: "vertical",
      },
    },
    pagination: {
      el: ".elevated_navigation_pagination",
      clickable: true,
      bulletClass: "elevated_navigation_pagination_bullet",
      bulletActiveClass: "is-active",
      verticalClass: ".elevated_navigation_pagination",
    },
    navigation: {
      prevEl: ".elevated_navigation_btn.is-prev",
      nextEl: ".elevated_navigation_btn.is-next",
    },
  });

  const elevatedVisualSwiper = new Swiper(".swiper.is-elevated-visual", {
    slidesPerView: 1,
    direction: "vertical",
    // Remove duplicate navigation controls to avoid conflicts
    allowTouchMove: true, // Keep touch functionality
  });

  // Sync function to prevent infinite loops
  let isUpdating = false;

  // Sync visual swiper when content swiper changes
  elevatedContentSwiper.on("slideChange", function () {
    if (!isUpdating) {
      isUpdating = true;
      elevatedVisualSwiper.slideTo(this.activeIndex, 300); // 300ms transition
      setTimeout(() => (isUpdating = false), 50);
    }
  });

  // Sync content swiper when visual swiper changes (if needed)
  elevatedVisualSwiper.on("slideChange", function () {
    if (!isUpdating) {
      isUpdating = true;
      elevatedContentSwiper.slideTo(this.activeIndex, 300);
      setTimeout(() => (isUpdating = false), 50);
    }
  });

  // Sync pagination updates
  elevatedContentSwiper.on("slideChangeTransitionEnd", function () {
    if (
      elevatedContentSwiper.pagination &&
      elevatedContentSwiper.pagination.render
    ) {
      elevatedContentSwiper.pagination.render();
      elevatedContentSwiper.pagination.update();
    }
  });
}

function testimonialSwiper() {
  let isUpdating = false;

  // const testimonialVisualSwiper = new Swiper(".swiper.is-testimonial-visual", {
  //   loop: true,
  //   spaceBetween: 16,
  //   slidesPerView: 3,
  //   centeredSlides: true,
  //   slideToClickedSlide: true,
  //   watchSlidesProgress: true,
  //   watchSlidesVisibility: true,
  //   freeMode: false,
  //   direction: "horizontal",

  //   breakpoints: {
  //     991: {
  //       effect: "fade",
  //       crossFade: true,
  //       direction: "vertical",
  //       slidesPerView: 3,
  //     },
  //   },
  // });

  // const testimonialSwiper = new Swiper(".swiper.is-testimonial", {
  //   loop: true,
  //   spaceBetween: 10,
  //   direction: "horizontal",
  //   thumbs: {
  //     swiper: testimonialVisualSwiper,
  //   },
  //   autoplay: {
  //     delay: 3000,
  //     disableOnInteraction: false,
  //   },

  //   breakpoints: {
  //     991: {
  //       effect: "fade",
  //       // crossFade: true,
  //       direction: "vertical",
  //       spaceBetween: 16,
  //     },
  //   },
  // });

  // // Sync visual swiper when content swiper changes
  // testimonialSwiper.on("slideChange", function () {
  //   if (!isUpdating) {
  //     isUpdating = true;
  //     testimonialVisualSwiper.slideToLoop(this.realIndex, 300);
  //     setTimeout(() => (isUpdating = false), 50);
  //   }
  // });

  // // Sync content swiper when visual swiper changes
  // testimonialVisualSwiper.on("slideChange", function () {
  //   if (!isUpdating) {
  //     isUpdating = true;
  //     testimonialSwiper.slideToLoop(this.realIndex, 300);
  //     setTimeout(() => (isUpdating = false), 50);
  //   }
  // });

  // const autoPlayDuration = 3000;

  // const testimonialAvatarSwiper = new Swiper(
  //   ".swiper.is-main-testimonial-avatar",
  //   {
  //     slidesPerView: 3,
  //     spaceBetween: 16,
  //     allowTouchMove: false,
  //     loop: true,
  //     centeredSlides: true,
  //     watchSlidesProgress: true,
  //     watchSlidesVisibility: true,
  //     autoplay: {
  //       delay: autoPlayDuration,
  //       disableOnInteraction: false,
  //     },
  //     navigation: {
  //       prevEl: ".main_testimonial_navigation [prev-btn]",
  //       nextEl: ".main_testimonial_navigation [next-btn]",
  //     },
  //     breakpoints: {
  //       992: {
  //         spaceBetween: 24,
  //         slidesPerView: "auto",
  //         direction: "vertical",
  //         autoHeight: true,
  //       },
  //     },
  //   }
  // );

  // const testimonialSwiper = new Swiper(".swiper.is-main-testimonial", {
  //   slidesPerView: 1,
  //   loop: true,
  //   effect: "fade",
  //   allowTouchMove: false,
  //   autoplay: {
  //     delay: autoPlayDuration,
  //     disableOnInteraction: false, // keeps autoplay running even after navigation
  //   },
  //   fadeEffect: {
  //     crossFade: true,
  //   },
  //   navigation: {
  //     prevEl: ".main_testimonial_navigation [prev-btn]",
  //     nextEl: ".main_testimonial_navigation [next-btn]",
  //   },
  //   breakpoints: {
  //     992: {
  //       direction: "vertical",
  //       autoHeight: true,
  //     },
  //   },
  // });
  const autoPlayDuration = 3000; // 30 detik

  const testimonialAvatarSwiper = new Swiper(
    ".swiper.is-main-testimonial-avatar",
    {
      slidesPerView: 3,
      spaceBetween: 16,
      initialSlide: 1,
      allowTouchMove: false,
      loop: true,
      centeredSlides: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      // autoplay: {
      //   delay: autoPlayDuration,
      //   disableOnInteraction: false,
      // },
      navigation: {
        prevEl: ".main_testimonial_navigation [prev-btn]",
        nextEl: ".main_testimonial_navigation [next-btn]",
      },
      breakpoints: {
        992: {
          spaceBetween: 24,
          slidesPerView: "auto",
          direction: "vertical",
          autoHeight: true,
        },
      },
    }
  );

  const testimonialSwiper = new Swiper(".swiper.is-main-testimonial", {
    slidesPerView: 1,
    loop: true,
    effect: "fade",
    allowTouchMove: false,
    // autoplay: {
    //   delay: autoPlayDuration,
    //   disableOnInteraction: false,
    // },
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      prevEl: ".main_testimonial_navigation [prev-btn]",
      nextEl: ".main_testimonial_navigation [next-btn]",
    },
    breakpoints: {
      992: {
        direction: "vertical",
        autoHeight: true,
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  elevatedSwiper();
  testimonialSwiper();
});

let designSwiper = null;
let lottieAnimations = [];
let lottieObserver = null;

/**
 * Removes duplicate SVG elements from Lottie animation containers
 */
function removeDuplicateLottieSVGs() {
  const lottieContainers = document.querySelectorAll(".lottie-animation");

  lottieContainers.forEach((container) => {
    const svgElements = container.querySelectorAll("svg");

    if (svgElements.length > 1) {
      // Remove all except the last SVG
      // for (let i = 0; i < svgElements.length - 1; i++) {
      // svgElements[i].remove();
      svgElements[1].remove();
      // }
    }
  });
}

function setupAnimations() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 992) {
    // --- MOBILE VIEW (Swiper) ---
    if (lottieObserver) {
      lottieObserver.disconnect();
      lottieObserver = null;
      lottieAnimations.forEach((anim) => anim.destroy());
      lottieAnimations = [];
    }

    if (!designSwiper) {
      document
        .querySelectorAll(".design-services_card_icon .lottie-animation")
        .forEach((element) => {
          element.innerHTML = "";
          const animationPath = element.getAttribute("data-src");
          if (animationPath) {
            const anim = lottie.loadAnimation({
              container: element,
              renderer: "svg",
              loop: false,
              autoplay: false,
              path: animationPath,
            });
            lottieAnimations.push(anim);
          }
        });

      // Clean up duplicates after Lottie initialization
      setTimeout(() => removeDuplicateLottieSVGs(), 100);

      designSwiper = new Swiper(".swiper.is-design", {
        slidesPerView: 1.1,
        spaceBetween: 8,
        breakpoints: { 768: { slidesPerView: 2.1, spaceBetween: 16 } },
        pagination: { el: ".swiper-pagination.is-design", clickable: true },
        on: {
          init: function () {
            setTimeout(() => {
              removeDuplicateLottieSVGs(); // Clean up after init
              if (lottieAnimations.length > 0) lottieAnimations[0].play();
            }, 200);
          },
          slideChange: function (swiper) {
            lottieAnimations.forEach((anim) => anim.stop());
            if (lottieAnimations[swiper.activeIndex]) {
              lottieAnimations[swiper.activeIndex].play();
            }
          },
        },
      });
    }
  } else {
    // --- DESKTOP VIEW (Intersection Observer) ---
    if (designSwiper) {
      designSwiper.destroy(true, true);
      designSwiper = null;
      lottieAnimations.forEach((anim) => anim.destroy());
      lottieAnimations = [];
    }

    if (!lottieObserver) {
      document
        .querySelectorAll(".design-services_card_icon .lottie-animation")
        .forEach((element) => {
          element.innerHTML = "";
          const animationPath = element.getAttribute("data-src");
          if (animationPath) {
            const anim = lottie.loadAnimation({
              container: element,
              renderer: "svg",
              loop: false,
              autoplay: false,
              path: animationPath,
            });
            element.lottieAnim = anim;
          }
        });

      // Clean up duplicates after Lottie initialization
      setTimeout(() => removeDuplicateLottieSVGs(), 100);

      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.lottieAnim) {
              entry.target.lottieAnim.play();
            }
          } else {
            if (entry.target.lottieAnim) {
              entry.target.lottieAnim.stop();
            }
          }
        });
      };

      lottieObserver = new IntersectionObserver(
        observerCallback,
        observerOptions
      );

      const targets = document.querySelectorAll(
        ".design-services_card_icon .lottie-animation"
      );
      targets.forEach((target) => lottieObserver.observe(target));
    }
  }
}

let resizeTimeoutSwiper;
function debouncedResize() {
  clearTimeout(resizeTimeoutSwiper);
  resizeTimeoutSwiper = setTimeout(() => {
    setupAnimations();
    // Clean up any duplicates that might appear during resize
    setTimeout(() => removeDuplicateLottieSVGs(), 150);
  }, 250);
}

window.addEventListener("load", setupAnimations);
window.addEventListener("resize", debouncedResize);

// Optional: Run cleanup periodically to catch any missed duplicates
setInterval(removeDuplicateLottieSVGs, 5000);

// function initDesignSwiper() {
//   const screenWidth = window.innerWidth;

//   if (screenWidth < 992 && !designSwiper) {
//     designSwiper = new Swiper(".swiper.is-design", {
//       slidesPerView: 1.1,
//       spaceBetween: 8,
//       breakpoints: {
//         768: {
//           slidesPerView: 2.1,
//           spaceBetween: 16,
//         },
//       },
//       pagination: {
//         el: ".swiper-pagination.is-design",
//         clickable: true,
//       },
//     });
//   } else if (screenWidth >= 992 && designSwiper) {
//     designSwiper.destroy(true, true);
//     designSwiper = null;
//   }
// }

// // Run on load
// window.addEventListener("load", initDesignSwiper);
// // Re-run on resize
// window.addEventListener("resize", initDesignSwiper);

function cleanupSwiper() {
  if (servicesSwiper) {
    servicesSwiper.destroy(true, true);
    servicesSwiper = null;
  }
  // if (appSwiper) {
  //   appSwiper.destroy(true, true);
  //   appSwiper = null;
  // }
}

function handleSwipers() {
  // initDesignSwiper();
  // initAppSwiper();
}

window.addEventListener("DOMContentLoaded", handleSwipers);
window.addEventListener("resize", handleSwipers);

document.addEventListener("DOMContentLoaded", function () {
  const portoSlideSwiper = new Swiper(".swiper.is-slider-porto", {
    slidesPerView: 0.8,
    spaceBetween: 16,
    breakpoints: {
      568: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
});

//

