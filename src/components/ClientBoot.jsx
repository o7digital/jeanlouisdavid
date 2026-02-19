import { useEffect } from "react";

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
  }, [route]);

  return null;
}
