"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/** Animate elements fading in on scroll */
export function fadeInOnScroll(
    selector: string | Element | Element[],
    options: {
        y?: number;
        x?: number;
        duration?: number;
        delay?: number;
        stagger?: number;
        trigger?: string | Element;
        start?: string;
        end?: string;
    } = {}
): gsap.core.Tween {
    const {
        y = 60,
        x = 0,
        duration = 1,
        delay = 0,
        stagger = 0.1,
        trigger,
        start = "top 85%",
        end = "bottom 20%",
    } = options;

    return gsap.from(selector, {
        y,
        x,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
            trigger: (trigger as gsap.DOMTarget) || (selector as gsap.DOMTarget),
            start,
            end,
            toggleActions: "play none none reverse",
        },
    });
}

/** Text reveal animation — character by character */
export function textReveal(
    selector: string | Element,
    options: {
        duration?: number;
        stagger?: number;
        delay?: number;
        trigger?: string | Element;
    } = {}
): gsap.core.Tween {
    const { duration = 0.8, stagger = 0.02, delay = 0, trigger } = options;

    return gsap.from(selector, {
        opacity: 0,
        y: 20,
        duration,
        stagger,
        delay,
        ease: "power4.out",
        scrollTrigger: trigger
            ? {
                trigger: trigger as gsap.DOMTarget,
                start: "top 80%",
                toggleActions: "play none none reverse",
            }
            : undefined,
    });
}

/** Create parallax effect on an element */
export function parallaxEffect(
    selector: string | Element,
    options: {
        speed?: number;
        trigger?: string | Element;
    } = {}
): gsap.core.Tween {
    const { speed = 0.5, trigger } = options;

    return gsap.to(selector, {
        y: () => window.innerHeight * speed * -1,
        ease: "none",
        scrollTrigger: {
            trigger: (trigger as gsap.DOMTarget) || (selector as gsap.DOMTarget),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
    });
}

/** Horizontal scroll section using ScrollTrigger pin */
export function horizontalScroll(
    container: string | Element,
    scrollContent: string | Element,
    options: {
        ease?: string;
        anticipatePin?: number;
    } = {}
): ScrollTrigger {
    const { ease = "none", anticipatePin = 1 } = options;
    const content = typeof scrollContent === "string"
        ? document.querySelector(scrollContent)
        : scrollContent;

    if (!content) throw new Error("Scroll content not found");

    const scrollWidth = (content as HTMLElement).scrollWidth - window.innerWidth;

    gsap.to(content, {
        x: -scrollWidth,
        ease,
        scrollTrigger: {
            trigger: container as gsap.DOMTarget,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin,
            invalidateOnRefresh: true,
        },
    });

    return ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1];
}

/** Cinematic scale reveal animation */
export function cinematicReveal(
    selector: string | Element,
    options: {
        scale?: number;
        duration?: number;
        delay?: number;
    } = {}
): gsap.core.Tween {
    const { scale = 0.5, duration = 1.5, delay = 0 } = options;

    return gsap.from(selector, {
        opacity: 0,
        scale,
        duration,
        delay,
        ease: "power4.out",
    });
}

/** Stagger reveal for a group of elements */
export function staggerReveal(
    selector: string | Element[],
    options: {
        y?: number;
        duration?: number;
        stagger?: number;
        trigger?: string | Element;
    } = {}
): gsap.core.Tween {
    const { y = 40, duration = 0.8, stagger = 0.1, trigger } = options;

    return gsap.from(selector, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: trigger
            ? {
                trigger: trigger as gsap.DOMTarget,
                start: "top 80%",
                toggleActions: "play none none reverse",
            }
            : undefined,
    });
}

/** Kill all ScrollTriggers — call on component cleanup */
export function killAllScrollTriggers(): void {
    ScrollTrigger.getAll().forEach((st) => st.kill());
}

/** Refresh ScrollTrigger — call after layout changes */
export function refreshScrollTrigger(): void {
    ScrollTrigger.refresh();
}
