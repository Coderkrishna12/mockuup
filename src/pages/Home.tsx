import React from 'react';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import TrendingCarousel from '../components/TrendingCarousel';
import CharacterNav from '../components/CharacterNav';
import ComicScroll from '../components/ComicScroll';
import Timeline from '../components/Timeline';
import MultiversePortal from '../components/MultiversePortal';

import ThanosGauntlet from '../components/ThanosGauntlet';
import Quiz from '../components/Quiz';
import KineticType from '../components/KineticType';
import HeroComparison from '../components/HeroComparison';
import NewsGrid from '../components/NewsGrid';
import Newsletter from '../components/Newsletter';
import MarvelUnlimited from '../components/MarvelUnlimited';
import FinalReveal from '../components/FinalReveal';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home: React.FC = () => {
    const containerRef = useScrollReveal();

    return (
        <main ref={containerRef}>
            <Loader />
            <Hero />
            <div className="scroll-reveal">
                <TrendingCarousel />
            </div>
            <div className="scroll-reveal delay-1">
                <CharacterNav />
            </div>
            <div className="scroll-reveal">
                <ComicScroll />
            </div>
            <div className="scroll-reveal">
                <Timeline />
            </div>
            <div className="scroll-reveal">
                <MultiversePortal />
            </div>
            <div className="scroll-reveal">
                <ThanosGauntlet />
            </div>
            <div className="scroll-reveal">
                <Quiz />
            </div>
            <div className="scroll-reveal">
                <KineticType />
            </div>
            <div className="scroll-reveal">
                <HeroComparison />
            </div>
            <div className="scroll-reveal">
                <NewsGrid />
            </div>
            <div className="scroll-reveal from-left">
                <MarvelUnlimited />
            </div>
            <div className="scroll-reveal">
                <Newsletter />
            </div>
            <div className="scroll-reveal scale-in">
                <FinalReveal />
            </div>
            <Footer />
        </main>
    );
};

export default Home;
