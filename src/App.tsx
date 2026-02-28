import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioProvider } from './contexts/AudioContext';
import Home from './pages/Home';
import Universe616 from './pages/Universe616';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Comics from './pages/Comics';
import News from './pages/News';
import TVShows from './pages/TVShows';
import MCUTimeline from './pages/MCUTimeline';
import HeroCompare from './pages/HeroCompare';
import About from './pages/About';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import StoneCollector from './components/StoneCollector';
import EasterEggs from './components/EasterEggs';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/news" element={<News />} />
        <Route path="/shows" element={<TVShows />} />
        <Route path="/timeline" element={<MCUTimeline />} />
        <Route path="/compare" element={<HeroCompare />} />
        <Route path="/about" element={<About />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/universe/616" element={<Universe616 />} />
        <Route path="/universe/838" element={
          <div style={{ color: 'teal', textAlign: 'center', marginTop: '20vh' }}>
            <h1>Earth-838</h1><p>Illuminati HQ.</p>
          </div>
        } />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <AudioProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-container">
            <CustomCursor />
            <Navbar />
            <EasterEggs />
            <StoneCollector />
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AudioProvider>
  );
}

export default App;
