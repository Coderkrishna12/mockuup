import React, { useState, useMemo, useCallback } from 'react';
import Footer from '../components/Footer';
import './Quiz.css';

interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

const allQuestions: Question[] = [
    { question: 'What is the name of Thor\'s hammer?', options: ['Stormbreaker', 'Mjolnir', 'Gungnir', 'Jarnbjorn'], correct: 1, explanation: 'Mjolnir was forged in the heart of a dying star and is enchanted by Odin.' },
    { question: 'Which Infinity Stone was hidden on Vormir?', options: ['Power Stone', 'Time Stone', 'Soul Stone', 'Mind Stone'], correct: 2, explanation: 'The Soul Stone required the sacrifice of a loved one to obtain. Red Skull guarded it.' },
    { question: 'Who said "I am Iron Man" first?', options: ['Tony Stark', 'Pepper Potts', 'Jarvis', 'Rhodey'], correct: 0, explanation: 'Tony Stark revealed his identity at the end of the first Iron Man film in 2008.' },
    { question: 'What is Captain America\'s shield made of?', options: ['Adamantium', 'Uru', 'Vibranium', 'Titanium'], correct: 2, explanation: 'The shield is made of vibranium, the same metal found in Wakanda.' },
    { question: 'Who is the villain of the first Avengers movie?', options: ['Ultron', 'Thanos', 'Loki', 'Red Skull'], correct: 2, explanation: 'Loki led the Chitauri invasion of New York in The Avengers (2012).' },
    { question: 'What year was Marvel Comics founded?', options: ['1939', '1941', '1950', '1961'], correct: 0, explanation: 'Marvel was founded as Timely Publications in 1939 by Martin Goodman.' },
    { question: 'Which hero has a vibranium suit?', options: ['Iron Man', 'Captain America', 'Black Panther', 'War Machine'], correct: 2, explanation: 'T\'Challa\'s Black Panther suit is made entirely of vibranium weave.' },
    { question: 'What is the name of Thanos\' home planet?', options: ['Xandar', 'Titan', 'Sakaar', 'Knowhere'], correct: 1, explanation: 'Thanos is from Titan, one of Saturn\'s moons in the MCU.' },
    { question: 'Who wields the Time Stone?', options: ['Thor', 'Vision', 'Doctor Strange', 'Wanda'], correct: 2, explanation: 'Doctor Strange uses the Time Stone, housed in the Eye of Agamotto.' },
    { question: 'How many Infinity Stones are there?', options: ['4', '5', '6', '8'], correct: 2, explanation: 'There are 6 Infinity Stones: Space, Mind, Reality, Power, Time, and Soul.' },
    { question: 'Who killed Thanos in Endgame?', options: ['Thor', 'Iron Man', 'Captain America', 'Hulk'], correct: 1, explanation: 'Tony Stark snapped the Infinity Stones, eliminating Thanos at the cost of his own life.' },
    { question: 'What is the Tesseract?', options: ['Mind Stone', 'Space Stone', 'Power Stone', 'Reality Stone'], correct: 1, explanation: 'The Tesseract contains the Space Stone, one of the six Infinity Stones.' },
    { question: 'Who founded the Avengers Initiative?', options: ['Tony Stark', 'Steve Rogers', 'Nick Fury', 'Phil Coulson'], correct: 2, explanation: 'Nick Fury created the Avengers Initiative to bring together a team of remarkable people.' },
    { question: 'What is Wakanda\'s primary export cover?', options: ['Textiles', 'Agriculture', 'Tourism', 'Mining'], correct: 0, explanation: 'Wakanda posed as a third-world nation relying on textiles to hide their vibranium-powered civilization.' },
    { question: 'Which Spider-Man movie featured three Spider-Men?', options: ['Homecoming', 'Far From Home', 'No Way Home', 'Into the Spider-Verse'], correct: 2, explanation: 'No Way Home united Tobey Maguire, Andrew Garfield, and Tom Holland as Spider-Man.' },
];

const Quiz: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const questions = useMemo(() => {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
    }, [gameState]);

    const startQuiz = useCallback(() => {
        setGameState('playing');
        setCurrentQ(0);
        setScore(0);
        setSelected(null);
        setShowExplanation(false);
    }, []);

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === questions[currentQ].correct) setScore(s => s + 1);
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentQ + 1 >= questions.length) {
            setGameState('result');
        } else {
            setCurrentQ(c => c + 1);
            setSelected(null);
            setShowExplanation(false);
        }
    };

    const getGrade = () => {
        const pct = (score / questions.length) * 100;
        if (pct >= 90) return { label: 'SUPREME', color: '#F0C040', emoji: '👑' };
        if (pct >= 70) return { label: 'AVENGER', color: '#22C55E', emoji: '⚡' };
        if (pct >= 50) return { label: 'RECRUIT', color: '#3B82F6', emoji: '🛡️' };
        return { label: 'CIVILIAN', color: '#64748B', emoji: '🌍' };
    };

    return (
        <div className="quiz-page">
            <header className="quiz-header">
                <div className="container">
                    <div className="quiz-badge">
                        <span className="badge-line"></span>
                        <span>TEST YOUR KNOWLEDGE</span>
                    </div>
                    <h1 className="quiz-title">MARVEL QUIZ</h1>
                </div>
            </header>

            <div className="container">
                {gameState === 'start' && (
                    <div className="quiz-start-card">
                        <div className="quiz-start-icon">🎯</div>
                        <h2 className="quiz-start-title">ARE YOU WORTHY?</h2>
                        <p className="quiz-start-desc">10 questions from across the Marvel Universe. Do you have what it takes to be an Avenger?</p>
                        <div className="quiz-start-info">
                            <span>10 Questions</span>
                            <span>·</span>
                            <span>Multiple Choice</span>
                            <span>·</span>
                            <span>Random Order</span>
                        </div>
                        <button className="btn-start-quiz" onClick={startQuiz}>BEGIN TRIAL</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="quiz-playing">
                        <div className="quiz-progress-bar">
                            <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        <div className="quiz-meta-row">
                            <span className="quiz-q-counter">QUESTION {currentQ + 1} / {questions.length}</span>
                            <span className="quiz-score-live">SCORE: {score}</span>
                        </div>

                        <div className="quiz-question-card">
                            <h2 className="quiz-question">{questions[currentQ].question}</h2>
                            <div className="quiz-options">
                                {questions[currentQ].options.map((opt, i) => {
                                    let cls = 'quiz-option';
                                    if (selected !== null) {
                                        if (i === questions[currentQ].correct) cls += ' correct';
                                        else if (i === selected) cls += ' wrong';
                                        else cls += ' dimmed';
                                    }
                                    return (
                                        <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                                            <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                                            <span className="opt-text">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {showExplanation && (
                                <div className="quiz-explanation">
                                    <p>{questions[currentQ].explanation}</p>
                                    <button className="btn-next-q" onClick={nextQuestion}>
                                        {currentQ + 1 < questions.length ? 'NEXT QUESTION →' : 'SEE RESULTS →'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="quiz-result-card">
                        <span className="result-emoji">{getGrade().emoji}</span>
                        <h2 className="result-grade" style={{ color: getGrade().color }}>{getGrade().label}</h2>
                        <div className="result-score">{score} / {questions.length}</div>
                        <p className="result-pct">{Math.round((score / questions.length) * 100)}% correct</p>
                        <div className="result-bar">
                            <div className="result-bar-fill" style={{ width: `${(score / questions.length) * 100}%`, background: getGrade().color }}></div>
                        </div>
                        <button className="btn-retry" onClick={startQuiz}>TRY AGAIN</button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Quiz;
