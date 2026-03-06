import { useEffect } from "react";
import { GIFT_CARD_ROUTE } from "../lib/routes";

const SUPPORTED_LOCALES = ["es", "en", "fr"];
const LOCALE_TAGS = {
  es: "es-MX",
  en: "en-US",
  fr: "fr-FR",
};

function getCurrentLocale() {
  const htmlLang = (document.documentElement.lang || "").toLowerCase();
  if (htmlLang.startsWith("fr")) return "fr";
  if (htmlLang.startsWith("en")) return "en";
  return "es";
}

function normalizeRoutePath(path) {
  if (!path || path === "/") return "/";
  const pathname = path.split("#")[0].split("?")[0] || "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function stripLocalePrefix(path) {
  return path.replace(/^\/(?:en|fr)(?=\/|$)/, "") || "/";
}

function buildLocalizedPath(basePath, locale) {
  if (locale === "es") return basePath;
  return `/${locale}${basePath === "/" ? "/" : basePath}`;
}

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

function enhanceMobileBurger(route) {
  const activeLocale = getCurrentLocale();
  const currentRoute = normalizeRoutePath(route || window.location.pathname || "/");
  const basePath = stripLocalePrefix(currentRoute);
  const giftCardsPath = buildLocalizedPath(GIFT_CARD_ROUTE, activeLocale);

  const ensureLanguageLinks = () => {
    const burgerMenu = document.querySelector("#av-burger-menu-ul");
    if (!(burgerMenu instanceof HTMLElement)) return;
    if (burgerMenu.querySelector(".jld-mobile-lang-item")) return;

    const languageItem = document.createElement("li");
    languageItem.className = "menu-item av-active-burger-items jld-mobile-lang-item";
    languageItem.setAttribute("role", "menuitem");

    const linksWrap = document.createElement("div");
    linksWrap.className = "jld-mobile-lang-links";
    linksWrap.setAttribute("aria-label", "Language switcher");
    linksWrap.setAttribute("role", "navigation");

    SUPPORTED_LOCALES.forEach((locale) => {
      const link = document.createElement("a");
      link.className = "jld-mobile-lang__link";
      if (locale === activeLocale) {
        link.classList.add("is-active");
      }

      link.href = buildLocalizedPath(basePath, locale);
      link.textContent = locale.toUpperCase();
      link.setAttribute("hreflang", LOCALE_TAGS[locale]);
      link.setAttribute("lang", LOCALE_TAGS[locale]);
      link.setAttribute("aria-label", LOCALE_TAGS[locale]);
      linksWrap.appendChild(link);
    });

    languageItem.appendChild(linksWrap);
    burgerMenu.appendChild(languageItem);
  };

  const ensureGiftCardsLink = () => {
    const burgerMenu = document.querySelector("#av-burger-menu-ul");
    if (!(burgerMenu instanceof HTMLElement)) return;
    if (burgerMenu.querySelector(`a[href="${giftCardsPath}"]`)) return;

    const giftCardsItem = document.createElement("li");
    giftCardsItem.className = "menu-item av-active-burger-items jld-mobile-gift-item";
    giftCardsItem.setAttribute("role", "menuitem");

    const giftCardsLink = document.createElement("a");
    giftCardsLink.href = giftCardsPath;
    if (basePath === GIFT_CARD_ROUTE) {
      giftCardsLink.setAttribute("aria-current", "page");
    }

    const giftCardsLabel = document.createElement("span");
    giftCardsLabel.className = "avia-menu-text";
    giftCardsLabel.textContent = "GIFT Cards";
    giftCardsLink.appendChild(giftCardsLabel);
    giftCardsItem.appendChild(giftCardsLink);

    const contactLink = burgerMenu.querySelector('a[href$="/contacto/"]');
    const languageItem = burgerMenu.querySelector(".jld-mobile-lang-item");
    const insertionTarget = contactLink?.closest("li") || languageItem;

    if (insertionTarget instanceof HTMLElement) {
      burgerMenu.insertBefore(giftCardsItem, insertionTarget);
      return;
    }

    burgerMenu.appendChild(giftCardsItem);
  };

  const handleBurgerNavigation = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("#av-burger-menu-ul a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;

    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#")) return;

    const resolved = new URL(rawHref, window.location.origin);
    if (resolved.origin !== window.location.origin) return;

    const nextPath = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath === currentPath) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.location.assign(nextPath);
  };

  ensureGiftCardsLink();
  ensureLanguageLinks();
  const refreshTimers = [140, 420, 900].map((delay) =>
    window.setTimeout(() => {
      ensureGiftCardsLink();
      ensureLanguageLinks();
    }, delay),
  );

  const menuObserver = new MutationObserver(() => {
    ensureGiftCardsLink();
    ensureLanguageLinks();
  });
  menuObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", handleBurgerNavigation, true);

  return () => {
    refreshTimers.forEach((timerId) => window.clearTimeout(timerId));
    menuObserver.disconnect();
    document.removeEventListener("click", handleBurgerNavigation, true);
  };
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
  const hasLayoutSensitiveWidgets = Boolean(
    document.querySelector(".av-masonry, .avia-content-slider"),
  );

  if (hasLayoutSensitiveWidgets || eagerRoutes.has(currentRoute) || eagerRoutes.has(normalizedRoute)) {
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
      normalizeContactSubmit();
    };

    runFallbacks();
    const cleanupBurger = enhanceMobileBurger(route);
    const cleanupLiteSpeed = deferLiteSpeedScripts(route);

    const refreshTimers = [150, 600, 1400].map((delay) =>
      window.setTimeout(runFallbacks, delay),
    );

    return () => {
      refreshTimers.forEach((timerId) => window.clearTimeout(timerId));
      cleanupBurger?.();
      cleanupLiteSpeed?.();
    };
  }, [route]);

  return null;
}
