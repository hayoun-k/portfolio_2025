import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
gsap.set("#coding", {opacity: 0});
gsap.set("#website", {scale: 0, opacity: 1});
let tl = gsap.timeline({repeat: 2, repeatDelay: 2});
tl.to("#type", {
  duration: 3,
  text: {
    value: "I am a frontend web developer",
  },
});
tl.to("#coding", {opacity: 1, duration: 1});
tl.to("#coding", {y: -300, scale: 0.5, opacity: 0, duration: 1, delay: 0.5});
tl.to("#website", {y: -50, scale: 1, duration: 1});