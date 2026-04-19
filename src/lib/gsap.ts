import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

export function setupGsap() {
  if (pluginsRegistered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.config({
    nullTargetWarn: false,
  });

  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  pluginsRegistered = true;
}

export { gsap, ScrollTrigger };
