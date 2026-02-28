"use client";

import { motion } from "framer-motion";
import { Film, Users, Clock, Globe, Sparkles, Zap, Heart, Code } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";

const techStack = [
    { name: "Next.js 16", desc: "React framework with App Router" },
    { name: "TypeScript", desc: "Type-safe development" },
    { name: "Tailwind CSS v4", desc: "Utility-first styling" },
    { name: "GSAP + ScrollTrigger", desc: "Cinematic scroll-driven animations" },
    { name: "Framer Motion", desc: "UI transitions & interactions" },
    { name: "Three.js + R3F", desc: "3D universe & particle effects" },
    { name: "Lenis", desc: "Smooth scroll experience" },
    { name: "shadcn/ui", desc: "Accessible component library" },
];

const features = [
    { icon: Film, title: "30+ MCU Films", desc: "Complete filmography from Phase 1 to Phase 5" },
    { icon: Users, title: "22 Characters", desc: "Full profiles with power stats, bios, and quotes" },
    { icon: Clock, title: "Interactive Timeline", desc: "GSAP horizontal scroll through MCU history" },
    { icon: Globe, title: "Multiverse Explorer", desc: "3D Three.js universe with orbiting reality bubbles" },
    { icon: Sparkles, title: "Particle Effects", desc: "8,000+ particles in cosmic formations" },
    { icon: Zap, title: "Demo Mode", desc: "Quick navigation for hackathon presentations" },
    { icon: Heart, title: "Accessible", desc: "Keyboard navigation, reduced motion, semantic HTML" },
    { icon: Code, title: "Performance", desc: "60fps animations, lazy loading, mobile optimization" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h1 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-4">
                        ABOUT THIS <span className="text-marvel-red">PROJECT</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                        A cinematic, immersive Marvel digital universe built for a hackathon design challenge.
                        Every scroll reveals a new chapter. Every interaction tells a story.
                    </p>
                </motion.div>

                {/* Design Challenge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-xl p-8 mb-16 border-l-4 border-marvel-red"
                >
                    <h2 className="font-heading text-2xl text-white tracking-wider mb-3">THE CHALLENGE</h2>
                    <p className="text-white/60 leading-relaxed text-lg italic">
                        &ldquo;Create a cinematic, immersive Marvel digital universe where users explore timelines,
                        characters, and story arcs interactively.&rdquo;
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="font-heading text-3xl text-white tracking-wider mb-8 text-center">
                        WHAT&apos;S <span className="text-marvel-gold">INSIDE</span>
                    </h2>
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={staggerItem}
                                className="glass rounded-xl p-5 group hover:border-marvel-red/20 border border-transparent transition-all"
                            >
                                <feature.icon size={24} className="text-marvel-red mb-3 group-hover:text-marvel-gold transition-colors" />
                                <h3 className="font-heading text-lg text-white tracking-wider mb-1">{feature.title}</h3>
                                <p className="text-xs text-white/40">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Tech Stack */}
                <div className="mb-16">
                    <h2 className="font-heading text-3xl text-white tracking-wider mb-8 text-center">
                        TECH <span className="text-marvel-blue">STACK</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {techStack.map((tech, i) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="glass rounded-lg p-4 text-center"
                            >
                                <p className="text-sm font-medium text-white mb-1">{tech.name}</p>
                                <p className="text-[10px] text-white/30">{tech.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Design Philosophy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-xl p-8 mb-16"
                >
                    <h2 className="font-heading text-2xl text-white tracking-wider mb-4">
                        INTERACTION <span className="text-marvel-purple">PHILOSOPHY</span>
                    </h2>
                    <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                        <p>🎬 Each scroll reveals story progression — sections behave like cinematic scenes.</p>
                        <p>🎥 Motion is camera-driven, not UI-driven — using anticipation → action → settle animation patterns.</p>
                        <p>🌌 The entire website feels like one connected universe with persistent cosmic backgrounds.</p>
                        <p>✨ Hover interactions feel &quot;energized&quot; with glow, depth, and motion response.</p>
                        <p>♿ Accessibility is respected — reduced motion, keyboard navigation, semantic HTML.</p>
                    </div>
                </motion.div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="font-heading text-4xl text-white tracking-wider mb-6">
                        START <span className="text-marvel-red">EXPLORING</span>
                    </h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/timeline" className="px-6 py-3 bg-marvel-red text-white rounded-lg hover:glow-red transition-all font-medium">
                            Interactive Timeline
                        </Link>
                        <Link href="/multiverse" className="px-6 py-3 border border-white/20 text-white rounded-lg hover:border-marvel-purple transition-all font-medium">
                            Multiverse Explorer
                        </Link>
                        <Link href="/characters" className="px-6 py-3 border border-white/20 text-white rounded-lg hover:border-marvel-gold transition-all font-medium">
                            Character Roster
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
