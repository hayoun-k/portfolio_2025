import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".bento-item");

let activeItem;

//gsap.set(popupTxt, { yPercent: -100});

function showDetails(item) {
  const popup = item.querySelector('dialog'); //details
const popupTxt = item.querySelector('.popup-text'); //detailContent
const popupImg = item.querySelector('.popup-img');
console.log(popup);
console.log(items.indexOf(item));

function hideDetails() {
    document.removeEventListener('click', hideDetails);
    gsap.set(popup, {overflow: "hidden"});
    console.log("333");

    const state = Flip.getState(popup);

    Flip.fit(popup, activeItem, {scale: true, fitChild: popupImg});

    const tl = gsap.timeline();
	tl.set(popup, {overflow: "hidden"})
    .to(popupTxt, {yPercent: -100})
	  .to(items, {opacity: 1, stagger: {amount: 0.7, from: items.indexOf(activeItem), grid: "auto"}});

    Flip.from(state, {
      scale: true,
      duration: 0.5,
      delay: 0.2,
      onInterrupt: () => tl.kill()
    })
      .set(popup, {visibility: "hidden", display: "none"});

    activeItem = null;
  }

  if (activeItem) {
    return hideDetails();
  }
  let onLoad = () => {

    Flip.fit(popup, item, {scale: true, fitChild: popupImg});

    const state = Flip.getState(popup);

    gsap.set(popup, {clearProps: true});
    gsap.set(popup, {xPercent: -50, top: "50%", yPercent: -50, visibility: "visibile", overflow: "hidden"});

    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      scale: true,
      onComplete: () => gsap.set(popup, {overflow: "auto"})
    })
      .to(popupTxt, {yPercent: 0}, 0.2);

    popupImg.removeEventListener("load", onLoad);
    document.addEventListener('click', hideDetails);
  };

  gsap.to(items, {opacity: 0.3, stagger: { amount: 0.7, from: items.indexOf(item), grid: "auto"}}).kill(item);
  activeItem = item;
}
  

  gsap.utils.toArray('.bento-item').forEach(item =>
    {
      item.addEventListener('click', () => 
      showDetails(item))}
  );

  
  const tlTwo = gsap.timeline({
    scrollTrigger: {
      trigger: '.bento-container',
      start: 'bottom 80%',
      toggleActions: 'play none none none',
      markers: true,
    }
  });

    tlTwo.from('.bento-item', {
      autoAlpha: 0, yPercent:30, stagger: 0.04, duration: 1, ease: 'power2.out'})