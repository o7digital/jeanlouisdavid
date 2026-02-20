import { useEffect } from "react";

function hydrateLazyImages() {
  document.querySelectorAll("img[data-src], img[data-srcset], img[data-sizes]").forEach((image) => {
    const src = image.getAttribute("src") || "";
    const dataSrc = image.getAttribute("data-src");
    const dataSrcSet = image.getAttribute("data-srcset");
    const dataSizes = image.getAttribute("data-sizes");

    if (dataSrc && (!src || src.startsWith("data:image/"))) {
      image.setAttribute("src", dataSrc);
    }

    if (dataSrcSet && !image.getAttribute("srcset")) {
      image.setAttribute("srcset", dataSrcSet);
    }

    if (dataSizes && !image.getAttribute("sizes")) {
      image.setAttribute("sizes", dataSizes);
    }
  });
}

function hydrateLazySources() {
  document.querySelectorAll("source[data-srcset]").forEach((source) => {
    const dataSrcSet = source.getAttribute("data-srcset");
    if (dataSrcSet && !source.getAttribute("srcset")) {
      source.setAttribute("srcset", dataSrcSet);
    }
  });
}

function revealMasonryFallback() {
  document.querySelectorAll(".av-masonry .av-masonry-entry").forEach((entry) => {
    if (entry.classList.contains("av-masonry-item-no-image")) {
      entry.setAttribute("aria-hidden", "true");
      entry.style.display = "none";
      return;
    }

    entry.style.visibility = "visible";
    entry.style.opacity = "1";
  });
}

function triggerLiteSpeedScripts() {
  if (window.__jldLiteSpeedTriggered) return;
  if (typeof window.litespeed_load_delayed_js_force !== "function") return;

  window.__jldLiteSpeedTriggered = true;
  window.litespeed_load_delayed_js_force();
}

function deferLiteSpeedScripts(route) {
  const interactionEvents = ["pointerdown", "wheel", "touchstart", "keydown", "mouseover"];
  const currentRoute = route || window.location.pathname;
  const normalizedRoute =
    currentRoute
      .replace(/^\/(?:en|fr)(?=\/)/, "")
      .replace(/\/?$/, "/") || "/";
  const eagerRoutes = new Set(["/servicios/"]);

  if (eagerRoutes.has(currentRoute) || eagerRoutes.has(normalizedRoute)) {
    const eagerTimerId = window.setTimeout(() => {
      triggerLiteSpeedScripts();
    }, 150);

    return () => {
      window.clearTimeout(eagerTimerId);
    };
  }

  const cleanupHandlers = [];
  let hasTriggered = false;
  let fallbackTimerId = null;
  let mapObserver = null;

  const triggerOnce = () => {
    if (hasTriggered) return;
    hasTriggered = true;

    triggerLiteSpeedScripts();
    cleanupHandlers.forEach((cleanup) => cleanup());
    cleanupHandlers.length = 0;
  };

  interactionEvents.forEach((eventName) => {
    const onInteraction = () => triggerOnce();
    window.addEventListener(eventName, onInteraction, { passive: true });
    cleanupHandlers.push(() => window.removeEventListener(eventName, onInteraction));
  });

  const mapNode = document.querySelector("#av_gmap_0, .av_gmaps_main_wrap");
  if (mapNode && "IntersectionObserver" in window) {
    mapObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          triggerOnce();
        }
      },
      { rootMargin: "250px 0px" },
    );
    mapObserver.observe(mapNode);
    cleanupHandlers.push(() => mapObserver?.disconnect());
  }

  fallbackTimerId = window.setTimeout(() => {
    triggerOnce();
  }, 5000);
  cleanupHandlers.push(() => window.clearTimeout(fallbackTimerId));

  return () => {
    cleanupHandlers.forEach((cleanup) => cleanup());
  };
}

export default function ClientBoot({ route }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-jld-clone", "astro-react");
    if (route) {
      document.documentElement.setAttribute("data-jld-route", route);
    }

    document
      .querySelectorAll(".avia-fullscreen-slider .avia-slideshow-inner > li[data-img-url]")
      .forEach((slide) => {
        const imageUrl = slide.getAttribute("data-img-url");
        if (imageUrl && slide.style.backgroundImage === "") {
          slide.style.backgroundImage = `url("${imageUrl}")`;
        }
      });

    const runFallbacks = () => {
      hydrateLazyImages();
      hydrateLazySources();
      revealMasonryFallback();
    };

    runFallbacks();
    const cleanupLiteSpeed = deferLiteSpeedScripts(route);

    const refreshTimers = [150, 600, 1400].map((delay) =>
      window.setTimeout(runFallbacks, delay),
    );

    return () => {
      refreshTimers.forEach((timerId) => window.clearTimeout(timerId));
      cleanupLiteSpeed?.();
    };
  }, [route]);

  return null;
}
