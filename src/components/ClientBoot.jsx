import { useEffect } from "react";

export default function ClientBoot({ route }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-jld-clone", "astro-react");
    if (route) {
      document.documentElement.setAttribute("data-jld-route", route);
    }
  }, [route]);

  return null;
}
