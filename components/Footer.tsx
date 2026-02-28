import Link from "next/link";
import { Github, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = [
    { label: "Movies", href: "/movies" },
    { label: "Characters", href: "/characters" },
    { label: "Timeline", href: "/timeline" },
    { label: "Multiverse", href: "/multiverse" },
];

const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/marvel", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/marvel", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/marvel", label: "YouTube" },
    { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-black/80 md:pb-0 pb-20">
            {/* Subtle red gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-marvel-red/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-marvel-red rounded flex items-center justify-center font-heading text-sm text-white">
                                M
                            </div>
                            <span className="font-heading text-xl tracking-wider text-white">
                                MARVEL <span className="text-marvel-red">UNIVERSE</span>
                            </span>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                            An immersive cinematic experience exploring the Marvel Cinematic Universe.
                            Built for the hackathon design challenge.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-heading text-lg tracking-wider text-white mb-4">EXPLORE</h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/40 hover:text-marvel-red transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-heading text-lg tracking-wider text-white mb-4">CONNECT</h3>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-marvel-red hover:border-marvel-red/30 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/30">
                        © 2024 Marvel Universe Explorer. Built for hackathon purposes.
                        All Marvel content belongs to Marvel Entertainment / Disney.
                    </p>
                    <p className="text-xs text-white/20">
                        Powered by Next.js, Three.js, GSAP & Framer Motion
                    </p>
                </div>
            </div>
        </footer>
    );
}
