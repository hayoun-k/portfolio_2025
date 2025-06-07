import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.set('#open', {opacity: 0});

gsap.to('#open', {
  scrollTrigger: '.bento-container',
  opacity: 1
});