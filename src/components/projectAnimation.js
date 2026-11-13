import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger);

const items = gsap.utils.toArray(".bento-item");
gsap.set('.bento-item', { autoAlpha: 0, y: 150 });

let activeItem;
let activeWrapper;
let activePopup;
let activePopupGrid;
let activePopupTxt;
let activePopupImg;
let isAnimating = false;

// Below this width the popup stacks to one column, so its grid must not be tweened.
const narrowQuery = window.matchMedia('(width < 720px)');

function isOutsidePopup(e) {
  const rect = activePopup.getBoundingClientRect();
  return (
    e.clientX < rect.left || e.clientX > rect.right ||
    e.clientY < rect.top || e.clientY > rect.bottom
  );
}

// Close on the close button or a click outside the popup (the modal backdrop).
function onDocumentClick(e) {
  if (!activePopup) return;
  if (e.target.closest('.closebutton') || isOutsidePopup(e)) {
    hideDetails();
  }
}

function hideDetails() {
  if (!activeItem || isAnimating) return;

  isAnimating = true;
  document.removeEventListener('click', onDocumentClick);

  const popup = activePopup;
  const state = Flip.getState(popup);
  Flip.fit(popup, activeWrapper, {scale: true, fitChild: activePopupImg});

  Flip.from(state, {scale: true, duration: 0.4})
    .set(popup, {overflow: "hidden", width: "unset", padding: 0}, 0)
    .set(activePopupImg, {overflow: "hidden", objectFit: "fill"}, 0)
    .to(activePopupGrid, narrowQuery.matches ? {duration: 0} : {gridTemplateColumns: "1fr 0", gap: 0, duration: 0.4}, 0) //text shrink
    .to(activePopupTxt, {yPercent: -100, overflow: "hidden", duration: 0.4}, 0)
    .to(items, {opacity: 1, duration: 0.4}, 0)
    .set(popup, {visibility: "hidden"})
    .call(() => {
      popup.close();
      isAnimating = false;
      activeItem = null;
      activeWrapper = null;
      activePopup = null;
      activePopupGrid = null;
      activePopupTxt = null;
      activePopupImg = null;
    });
}

function showDetails(item) {
  if (activeItem) return;
  openItem(item);
}

function openItem(item) {
  if (isAnimating) return;
  isAnimating = true;
  
  const popup = item.querySelector('dialog');
  const wrapper = item.querySelector('.project-wrapper');
  const popupGrid = item.querySelector('.popup-wrapper');
  const popupTxt = item.querySelector('.popup-text');
  const popupImg = item.querySelector('.popup-img');
  
  // Store references globally
  activePopup = popup;
  activeWrapper = wrapper;
  activePopupGrid = popupGrid;
  activePopupTxt = popupTxt;
  activePopupImg = popupImg;
  activeItem = item;

  Flip.fit(popup, item, {scale: true, fitChild: popupImg});
  const state = Flip.getState(popup);

  popup.showModal();

  gsap.set(popupImg, {
    clearProps: true,
  })

  gsap.set(popup, {
    clearProps: true,
  });
  gsap.set(popup, {
    xPercent: -50, 
    top: "50%", 
    yPercent: -50, 
    visibility: "visible",
    overflow: "hidden",
    width: narrowQuery.matches ? "92vw" : "clamp(50%, 75vw, 90%)"
  })



  Flip.from(state, {
    duration: 0.3,
    ease: "power2.inOut",
    scale: true,
    absolute: true,
    onComplete: () => {
      gsap.set(popup, {overflow: "auto"});
      isAnimating = false;
      // Add document listener after a brief delay
      setTimeout(() => {
        document.addEventListener('click', onDocumentClick);
      }, 100);
    }
  }).to(popupTxt, { yPercent: 0, overflow: "hidden"}, 0.2)
    .to(popupGrid, narrowQuery.matches ? {duration: 0} : { gridTemplateColumns: "2.5fr 1.5fr"}, 0.2);

  gsap.to(items, {opacity: 0.3, duration: 0.1});
}

// Add click listeners
items.forEach(item => {
  item.addEventListener('click', (e) => {
    // Clicks inside the open popup bubble up here; leave them to onDocumentClick.
    if (e.target.closest('dialog')) return;
    e.stopPropagation();
    showDetails(item);
  });

  // Escape fires "cancel"; route it through the animated close so state stays in sync.
  item.querySelector('dialog').addEventListener('cancel', (e) => {
    e.preventDefault();
    hideDetails();
  });
});

// ScrollTrigger animation
const tlTwo = gsap.timeline({
  scrollTrigger: {
    trigger: '.bento-container',
    start: 'top 60%',
    toggleActions: 'play none none none'
  }
});

tlTwo.fromTo('.bento-item',
  { autoAlpha: 0, y: 150 },
  { 
    autoAlpha: 1, 
    y: 0, 
    stagger: 0.04, 
    duration: 0.5,
    ease: 'power2.out'
  }
);