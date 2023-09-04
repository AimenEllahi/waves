import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  toggleActions: "restart pause resume pause",
  scroller: ".container",
});

gsap.to(".orange p", {
  scrollTrigger: ".orange",
  duration: 2,
  rotation: 360,
});

gsap.to(".red", {
  scrollTrigger: {
    trigger: ".red",
    toggleActions: "restart pause reverse pause",
  },
  duration: 1,
  backgroundColor: "#FFA500",
  ease: "none",
});
