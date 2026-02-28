/** Shared animation variants for Framer Motion */
import type { Variants, Transition } from "framer-motion";

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const slideInLeft: Variants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
};

export const slideInRight: Variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
};

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
};

export const cardFlip: Variants = {
    front: {
        rotateY: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
    back: {
        rotateY: 180,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
};

/** Page transition variant — cinematic red wipe */
export const pageTransition: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

/** Spring transition for interactive elements */
export const springTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 25,
};

/** Smooth transition defaults */
export const smoothTransition: Transition = {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
};
