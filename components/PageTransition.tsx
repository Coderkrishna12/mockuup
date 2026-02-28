"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition } from "@/lib/animations";

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-screen"
            >
                {/* Red flash overlay on transition */}
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
                    className="fixed inset-0 z-[150] bg-marvel-red origin-right pointer-events-none"
                />
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
