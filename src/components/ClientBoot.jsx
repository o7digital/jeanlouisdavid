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
  document.querySelectorAll(".av-masonry-container.av-js-disabled").forEach((container) => {
    container.classList.remove("av-js-disabled");
  });

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

function loadLiteSpeedScripts() {
  if (typeof window.litespeed_load_delayed_js_force === "function") {
    window.litespeed_load_delayed_js_force();
  }
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
    loadLiteSpeedScripts();

    const refreshTimers = [150, 600, 1400].map((delay) =>
      window.setTimeout(runFallbacks, delay),
    );

    return () => {
      refreshTimers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [route]);

  return null;
}
