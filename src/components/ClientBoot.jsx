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

function normalizeCollectionCards() {
  if (!document.body.classList.contains("page-id-164")) return;

  document.querySelectorAll("#top .avia-content-slider .slide-entry").forEach((entry) => {
    if (!(entry instanceof HTMLElement)) return;

    const wrap = entry.closest(".slide-entry-wrap");
    if (wrap instanceof HTMLElement && window.getComputedStyle(wrap).display === "none") return;

    const imageLink = entry.querySelector("a.slide-image");
    const titleLink = entry.querySelector(".slide-entry-title a");
    const legacyContent = entry.querySelector(".slide-content");

    if (legacyContent instanceof HTMLElement) {
      legacyContent.style.display = "none";
    }

    if (!(imageLink instanceof HTMLAnchorElement)) return;
    if (!(titleLink instanceof HTMLAnchorElement)) return;
    if (entry.querySelector("a.jld-slide-caption")) return;

    const caption = document.createElement("a");
    caption.className = "jld-slide-caption";
    caption.href = titleLink.getAttribute("href") || imageLink.getAttribute("href") || "#";
    caption.textContent = (titleLink.textContent || "").trim();

    const titleValue = titleLink.getAttribute("title");
    if (titleValue) {
      caption.setAttribute("title", titleValue);
    }

    imageLink.insertAdjacentElement("afterend", caption);
  });
}

function normalizeContactSubmit() {
  if (!document.body.classList.contains("page-id-150")) return;

  const form = document.querySelector("#top form.avia_ajax_form");
  if (!(form instanceof HTMLFormElement)) return;

  let submitInput = form.querySelector('input[type="submit"].button');
  if (!(submitInput instanceof HTMLInputElement)) return;

  const messageField = form.querySelector("#element_avia_4_1");
  if (!(messageField instanceof HTMLElement)) return;

  let submitRow = form.querySelector("p.jld-submit-row");
  if (!(submitRow instanceof HTMLParagraphElement)) {
    submitRow = document.createElement("p");
    submitRow.className = "form_element form_fullwidth jld-submit-row";
    messageField.insertAdjacentElement("afterend", submitRow);
  }

  if (!submitRow.contains(submitInput)) {
    submitRow.appendChild(submitInput);
  }

  form.querySelectorAll('p.form_element input[type="submit"].button').forEach((node) => {
    if (!(node instanceof HTMLInputElement) || node === submitInput) return;
    const wrapper = node.closest("p.form_element");
    wrapper?.remove();
  });

  const legacyWrapper = submitInput.closest("p.form_element");
  if (legacyWrapper instanceof HTMLParagraphElement && legacyWrapper !== submitRow) {
    legacyWrapper.remove();
  }

  submitInput = form.querySelector("p.jld-submit-row input[type='submit'].button");
  if (!(submitInput instanceof HTMLInputElement)) return;

  const lang = document.documentElement.lang || "";
  if (lang.startsWith("fr")) {
    submitInput.value = "Envoyer le message";
  } else if (lang.startsWith("en")) {
    submitInput.value = "Send message";
  } else {
    submitInput.value = "Enviar mensaje";
  }
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
      normalizeCollectionCards();
      normalizeContactSubmit();
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
