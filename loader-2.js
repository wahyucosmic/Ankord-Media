const revealTransition = () => {
  const wrap = document.querySelector(".loader_wrap");
  const logo = wrap.querySelector(".loader_logo_wrap");
  const body = document.body;

  const tl = gsap.timeline({
    defaults: {
      ease: "none",
      duration: 0.75,
    },
    onComplete: () => {
      gsap.set(wrap, {
        clipPath: "100% 0% 0% 0%",
      });
      gsap.set(body, {
        height: "auto",
        overflow: "visible",
      });
    },
  });

  tl.set(logo, {
    yPercent: 0,
    opacity: 1,
  });

  tl.set(body, {
    height: "100vh",
    overflow: "clip",
  });

  tl.to(logo, {
    yPercent: -100,
    ease: "power4.out",
    opacity: 0,
  }).to(
    wrap,
    {
      clipPath: "inset(0% 0% 100% 0%)",
      ease: "power1.out",
      duration: 0.5,
    },
    "<+=50%"
  );
};

const pageTransition = () => {
  return new Promise((resolve) => {
    const wrap = document.querySelector(".loader_wrap");
    const logo = wrap.querySelector(".loader_logo_wrap");
    const body = document.body;

    const tl = gsap.timeline({
      defaults: {
        ease: "none",
        duration: 0.75,
      },
      onComplete: resolve,
    });

    tl.set(body, {
      height: "100vh",
      overflow: "clip",
    });

    tl.set(wrap, {
      clipPath: "inset(100% 0% 0% 0%)",
    });

    tl.set(logo, {
      yPercent: 100,
      opacity: 0,
    });

    tl.to(wrap, {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "power1.out",
      duration: 0.5,
    }).to(
      logo,
      {
        yPercent: 0,
        opacity: 1,
        ease: "power4.out",
      },
      "<+=80%"
    );
  });
};

// Helper function to wait for page load
const waitForPageLoad = (url) => {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";

    iframe.onload = () => {
      document.body.removeChild(iframe);
      resolve();
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      resolve();
    };

    document.body.appendChild(iframe);
    iframe.src = url;
  });
};

// Handle initial page load
window.addEventListener("load", () => {
  revealTransition();
});

// ADD THIS: Handle back/forward navigation
window.addEventListener("pageshow", (event) => {
  // Only run reveal transition if coming from cache (back/forward navigation)
  if (event.persisted) {
    revealTransition();
  }
});

// Alternative approach - also handle popstate for more comprehensive coverage
window.addEventListener("popstate", () => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    revealTransition();
  }, 50);
});

// Handle link clicks (your existing code)
document.querySelectorAll("a").forEach((link) => {
  const preventTransition = link.hasAttribute("data-transition-prevent");
  link.addEventListener("click", async (event) => {
    const href = link.getAttribute("href");

    if (
      href &&
      !href.startsWith("#") &&
      href !== window.location.pathname &&
      !preventTransition &&
      !href.startsWith("mailto") &&
      !href.startsWith("tel")
    ) {
      event.preventDefault();

      const [animationComplete, pageLoaded] = await Promise.all([
        pageTransition(),
        waitForPageLoad(href),
      ]);

      window.location.href = href;
    }
  });
});
