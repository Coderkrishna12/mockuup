import React, { useState } from 'react';
import { charactersData } from '../../utils/charactersData';
import './Quiz.css';

type HeroKey = keyof typeof charactersData;

type Question = {
    id: number;
    text: string;
    options: {
        text: string;
        scores: Partial<Record<HeroKey, number>>;
    }[];
};

const quizQuestions: Question[] = [
    {
        id: 1,
        text: "You see a threat approaching. You...",
        options: [
            { text: "Charge in head first", scores: { hulk: 10, thor: 5 } },
            { text: "Make a plan", scores: { ironman: 10, cap: 5 } },
            { text: "Call for backup", scores: { cap: 10 } },
            { text: "Assess the magical implications", scores: { strange: 10 } }
        ]
    },
    {
        id: 2,
        text: "Your greatest strength is...",
        options: [
            { text: "Technology and intellect", scores: { ironman: 10 } },
            { text: "Raw, unbridled power", scores: { hulk: 10, thor: 5 } },
            { text: "Strategy and leadership", scores: { cap: 10 } },
            { text: "Mystic arts and knowledge", scores: { strange: 10 } }
        ]
    },
    {
        id: 3,
        text: "You fight for...",
        options: [
            { text: "The future", scores: { ironman: 10, strange: 5 } },
            { text: "The present", scores: { thor: 10 } },
            { text: "Everyone, no matter the cost", scores: { cap: 10, hulk: 5 } },
            { text: "The balance of the universe", scores: { strange: 10 } }
        ]
    },
    {
        id: 4,
        text: "Your team calls you...",
        options: [
            { text: "The leader", scores: { cap: 10, ironman: 5 } },
            { text: "The muscle", scores: { hulk: 10, thor: 5 } },
            { text: "The genius", scores: { ironman: 10, strange: 5 } },
            { text: "The wildcard", scores: { thor: 10, hulk: 5 } }
        ]
    }
];

const Quiz: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'intro' | 'question' | 'result'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState<Record<HeroKey, number>>({
        ironman: 0, thor: 0, cap: 0, strange: 0, hulk: 0
    });
    const [resultHero, setResultHero] = useState<HeroKey | null>(null);

    const startQuiz = () => {
        setCurrentStep('question');
        setCurrentQuestionIndex(0);
        setScores({ ironman: 0, thor: 0, cap: 0, strange: 0, hulk: 0 });
    };

    const handleAnswer = (optionScores: Partial<Record<HeroKey, number>>) => {
        const newScores = { ...scores };
        Object.keys(optionScores).forEach(key => {
            newScores[key as HeroKey] += optionScores[key as HeroKey] || 0;
        });
        setScores(newScores);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores: Record<HeroKey, number>) => {
        let topHero: HeroKey = 'ironman';
        let maxScore = 0;

        Object.entries(finalScores).forEach(([hero, score]) => {
            if (score > maxScore) {
                maxScore = score;
                topHero = hero as HeroKey;
            }
        });

        setResultHero(topHero);
        setCurrentStep('result');
    };

    const shareResult = async () => {
        if (!resultHero) return;
        const heroName = resultHero.toUpperCase();
        const text = `I took the Marvel Quiz and got ${heroName}! " ${charactersData[resultHero].quote} "\nTake the test: https://marvel-multiverse.demo`;

        try {
            await navigator.clipboard.writeText(text);
            alert('Result copied to clipboard!');
        } catch (e) {
            console.error("Failed to copy", e);
        }
    };

    return (
        <section className="quiz-section" id="quiz">
            <div className="container quiz-container">

                {currentStep === 'intro' && (
                    <div className="quiz-intro">
                        <h2>WHO ARE YOU IN THE MULTIVERSE?</h2>
                        <p>Take the personality assessment to discover your inner hero.</p>
                        <button className="btn-primary" onClick={startQuiz}>BEGIN ASSESSMENT</button>
                    </div>
                )}

                {currentStep === 'question' && (
                    <div className="quiz-question-box">
                        <div className="quiz-progress">
                            QUESTION {currentQuestionIndex + 1} OF {quizQuestions.length}
                        </div>
                        <h3 className="question-text">{quizQuestions[currentQuestionIndex].text}</h3>
                        <div className="options-grid">
                            {quizQuestions[currentQuestionIndex].options.map((opt, i) => (
                                <button
                                    key={i}
                                    className="quiz-option-btn"
                                    onClick={() => handleAnswer(opt.scores)}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 'result' && resultHero && (
                    <div className="quiz-result-reveal" style={{ '--result-color': charactersData[resultHero].primary } as React.CSSProperties}>
                        <div className="result-card">
                            <h3>YOUR HERO PROFILE</h3>
                            <h2 className="result-hero-name" style={{ color: 'var(--result-color)' }}>{resultHero.toUpperCase()}</h2>
                            <p className="result-quote">"{charactersData[resultHero].quote}"</p>

                            <div className="result-stats">
                                <div className="stat-bar"><div className="stat-fill" style={{ width: `${(scores[resultHero] / 40) * 100}%`, background: 'var(--result-color)' }}></div></div>
                                <span className="stat-label">AFFINITY SCORE</span>
                            </div>

                            <div className="result-actions">
                                <button className="btn-secondary" onClick={startQuiz}>RETAKE QUIZ</button>
                                <button className="btn-primary" onClick={shareResult}>SHARE RESULT</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Quiz;
