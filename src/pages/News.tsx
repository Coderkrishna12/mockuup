import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allNews, newsCategories } from '../utils/newsData';
import Footer from '../components/Footer';
import './News.css';

const News: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (activeCategory === 'All') return allNews;
        return allNews.filter(n => n.category === activeCategory);
    }, [activeCategory]);

    const featured = filtered.filter(n => n.featured);
    const regular = filtered.filter(n => !n.featured);

    return (
        <div className="news-page">
            <header className="news-page-header">
                <Link to="/" className="back-link">← BACK TO HOME</Link>
                <div className="container">
                    <div className="news-pg-badge">
                        <span className="badge-line"></span>
                        <span>LATEST FROM THE MULTIVERSE</span>
                    </div>
                    <h1 className="news-page-title">NEWS</h1>
                    <p className="news-pg-subtitle">{allNews.length} articles from across the Marvel Universe</p>
                </div>
            </header>

            <div className="container">
                {/* Category Filters */}
                <div className="news-pg-filters">
                    <button
                        className={`cat-btn ${activeCategory === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('All')}
                    >ALL</button>
                    {newsCategories.map(cat => (
                        <button
                            key={cat}
                            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >{cat}</button>
                    ))}
                </div>

                {/* Featured Articles */}
                {featured.length > 0 && (
                    <div className="news-featured-row">
                        {featured.map(article => (
                            <div
                                key={article.id}
                                className="news-featured-card"
                                style={{ '--news-color': article.color } as React.CSSProperties}
                                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                            >
                                <div className="featured-bg" style={{ background: `linear-gradient(135deg, ${article.color}15, transparent)` }}></div>
                                <div className="featured-content">
                                    <div className="featured-top">
                                        <span className="featured-cat">{article.category}</span>
                                        <span className="featured-date">{article.date}</span>
                                    </div>
                                    <h2 className="featured-title">{article.title}</h2>
                                    <p className="featured-excerpt">{article.excerpt}</p>
                                    {expandedId === article.id && (
                                        <div className="article-expanded">
                                            <p className="article-content">{article.content}</p>
                                            <div className="article-meta-row">
                                                <span className="article-author">By {article.author}</span>
                                                <span className="article-read-time">{article.readTime}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="featured-cta">
                                        <span>{expandedId === article.id ? 'SHOW LESS' : 'READ ARTICLE'}</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Regular Articles */}
                <div className="news-articles-grid">
                    {regular.map((article, i) => (
                        <article
                            key={article.id}
                            className="news-article-card"
                            style={{ '--news-color': article.color, '--anim-delay': `${i * 60}ms` } as React.CSSProperties}
                            onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                        >
                            <div className="article-card-top">
                                <span className="article-cat" style={{ color: article.color }}>{article.category}</span>
                                <span className="article-date">{article.date}</span>
                            </div>
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-excerpt">{article.excerpt}</p>
                            {expandedId === article.id && (
                                <div className="article-expanded">
                                    <p className="article-content">{article.content}</p>
                                    <div className="article-meta-row">
                                        <span className="article-author">By {article.author}</span>
                                        <span className="article-read-time">{article.readTime}</span>
                                    </div>
                                </div>
                            )}
                            <div className="article-card-cta">
                                <span>{expandedId === article.id ? 'SHOW LESS' : 'READ MORE'}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default News;
