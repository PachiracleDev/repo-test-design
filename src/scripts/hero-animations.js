import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const setConnectorDash = (paths) => {
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  });
};

const setVisibleState = () => {
  gsap.set(
    [
      "[data-animate='header']",
      "[data-animate='microproof']",
      "[data-word]",
      "[data-animate='subtext']",
      "[data-animate='cta']",
      "[data-animate='guarantee']",
      "[data-animate='product']",
      "[data-badge]",
      "[data-callout]"
    ],
    { clearProps: "all", opacity: 1 }
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      noReduce: "(prefers-reduced-motion: no-preference)"
    },
    (context) => {
      const { reduceMotion, noReduce } = context.conditions;
      const connectorPaths = gsap.utils.toArray("[data-connector]");

      if (reduceMotion) {
        setConnectorDash(connectorPaths);
        gsap.set(connectorPaths, { strokeDashoffset: 0 });
        setVisibleState();
        return;
      }

      if (!noReduce) return;

      setConnectorDash(connectorPaths);

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
      });

      tl.from("[data-animate='header']", { y: -20, autoAlpha: 0, duration: 0.65 }, 0)
        .from("[data-animate='microproof']", { y: 20, autoAlpha: 0 }, 0.1)
        .from("[data-word]", { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.65 }, 0.2)
        .from("[data-animate='product']", { scale: 1.05, autoAlpha: 0, duration: 1.2 }, 0.3)
        .from("[data-animate='subtext']", { y: 15, autoAlpha: 0, duration: 0.6 }, 0.5)
        .from("[data-animate='cta']", { scale: 0.95, autoAlpha: 0, duration: 0.55, ease: "back.out(1.7)" }, 0.6)
        .from("[data-animate='guarantee']", { autoAlpha: 0, duration: 0.5 }, 0.75)
        .from("[data-badge]", { scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0.9)
        .from("[data-callout]", { x: -20, autoAlpha: 0, stagger: 0.15, duration: 0.5 }, 1)
        .to(
          "[data-connector]",
          { strokeDashoffset: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
          1.1
        );

      gsap.to(".hero-product", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to("[data-badge]", {
        scale: 1.04,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center"
      });
    }
  );
});
