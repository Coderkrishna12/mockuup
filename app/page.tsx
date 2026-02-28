"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Film, Users, Clock, Globe } from "lucide-react";

import HeroSection from "@/components/HeroSection";
import MovieCard from "@/components/MovieCard";
import CharacterShowcase from "@/components/CharacterShowcase";
import { movies } from "@/data/movies";
import { useReducedMotion } from "@/lib/hooks";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = [
  { num: 1, title: "Phase One", subtitle: "The Beginning", years: "2008–2012", color: "#3B82F6", movies: movies.filter((m) => m.phase === 1) },
  { num: 2, title: "Phase Two", subtitle: "Expansion", years: "2013–2015", color: "#EF4444", movies: movies.filter((m) => m.phase === 2) },
  { num: 3, title: "Phase Three", subtitle: "Infinity Saga", years: "2016–2019", color: "#FFD700", movies: movies.filter((m) => m.phase === 3) },
  { num: 4, title: "Phase Four", subtitle: "Multiverse Saga", years: "2021–2022", color: "#A855F7", movies: movies.filter((m) => m.phase === 4) },
  { num: 5, title: "Phase Five", subtitle: "New Era", years: "2023–2024", color: "#EC4899", movies: movies.filter((m) => m.phase === 5) },
];

const featuredMovies = movies.filter((m) =>
  ["avengers-endgame", "avengers-infinity-war", "black-panther", "spider-man-no-way-home"].includes(m.id)
);

const stats = [
  { icon: Film, label: "Movies", value: "30+" },
  { icon: Users, label: "Characters", value: "20+" },
  { icon: Clock, label: "Years of MCU", value: "16" },
  { icon: Globe, label: "Universes", value: "8" },
];

export default function HomePage() {
  const reducedMotion = useReducedMotion();
  const phasesContainerRef = useRef<HTMLDivElement>(null);
  const phasesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !phasesContainerRef.current || !phasesScrollRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll for phases
      const scrollContent = phasesScrollRef.current;
      if (!scrollContent) return;

      const scrollWidth = scrollContent.scrollWidth - window.innerWidth;

      gsap.to(scrollContent, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: phasesContainerRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Fade in sections
      gsap.utils.toArray<HTMLElement>(".scroll-section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Parallax for featured section
      gsap.to(".featured-parallax", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".featured-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="relative">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <HeroSection />

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="scroll-section relative z-10 py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <stat.icon size={24} className="mx-auto text-marvel-red mb-2" />
                <p className="font-heading text-3xl text-white">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ HORIZONTAL SCROLL PHASES ═══════════════════ */}
      <section ref={phasesContainerRef} className="relative z-10 min-h-screen">
        {/* Sticky header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-4xl md:text-5xl text-white tracking-wider">
              EXPLORE THE <span className="text-marvel-red">MCU</span>
            </h2>
            <p className="text-sm text-white/40 mt-2">
              Scroll to journey through the phases →
            </p>
          </div>
        </div>

        <div
          ref={phasesScrollRef}
          className="flex items-center h-screen pt-24 gpu-accelerated"
          style={{ width: `${phases.length * 100 + 50}vw` }}
        >
          {phases.map((phase) => (
            <div
              key={phase.num}
              className="flex-shrink-0 w-screen h-full flex items-center px-6 md:px-12"
            >
              <div className="max-w-7xl mx-auto w-full">
                {/* Phase header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.color, boxShadow: `0 0 20px ${phase.color}50` }}
                    />
                    <span className="text-sm font-medium" style={{ color: phase.color }}>
                      {phase.years}
                    </span>
                  </div>
                  <h3 className="font-heading text-5xl md:text-7xl text-white tracking-wider">
                    {phase.title}
                  </h3>
                  <p className="text-lg text-white/40 mt-1">{phase.subtitle}</p>
                </div>

                {/* Phase movies */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                  {phase.movies.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* End CTA */}
          <div className="flex-shrink-0 w-[50vw] h-full flex items-center justify-center px-12">
            <div className="text-center">
              <h3 className="font-heading text-4xl text-white mb-4">Ready to explore?</h3>
              <Link
                href="/movies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-marvel-red text-white rounded-lg hover:glow-red transition-all"
              >
                View All Movies <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED MOVIES ═══════════════════ */}
      <section className="scroll-section featured-section relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-6xl text-white tracking-wider mb-3">
              ICONIC <span className="text-marvel-gold text-glow-gold">MOMENTS</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto">
              The movies that defined a generation and changed cinema forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredMovies.map((movie, i) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="group relative h-[300px] md:h-[400px] rounded-xl overflow-hidden gpu-accelerated"
              >
                <div className="featured-parallax absolute inset-0">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    unoptimized={true}
                    onError={(e) => {
                      e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg";
                      e.currentTarget.className = "object-contain p-12 opacity-40";
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-marvel-red/30 rounded-xl transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs text-marvel-red font-medium">Phase {movie.phase} • {movie.year}</span>
                  <h3 className="font-heading text-3xl md:text-4xl text-white tracking-wider mt-1">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-white/50 mt-2 line-clamp-2">{movie.synopsis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CHARACTER SHOWCASE (from Home Page B) ═══════════════════ */}
      <CharacterShowcase />

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="scroll-section relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-5xl md:text-7xl text-white tracking-wider mb-4">
              THE STORY <span className="text-marvel-red text-glow-red">CONTINUES</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-8">
              Explore the interactive timeline, dive into the multiverse, and discover every connection in the MCU.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/timeline"
                className="inline-flex items-center gap-2 px-8 py-3 bg-marvel-red text-white font-medium rounded-lg hover:glow-red-intense transition-all hover:scale-105 gpu-accelerated"
              >
                <Clock size={18} />
                Interactive Timeline
              </Link>
              <Link
                href="/multiverse"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:border-marvel-purple hover:bg-white/5 transition-all hover:scale-105 gpu-accelerated"
              >
                <Globe size={18} />
                Multiverse Explorer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
