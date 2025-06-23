import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.set('#open', {opacity: 0});

gsap.to('#open', {
  scrollTrigger: '.bento-container',
  opacity: 1
});


//turnstile
const myForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("sendBtn");

function onloadTurnstileCallback() {
  console.debug('onloadTurnstileCallback called');

  turnstile.render('#turnstile-container', {
    sitekey: '0x4AAAAAABg50lIh3WdShTJl',
    theme: 'light',
  })
};
myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  

});