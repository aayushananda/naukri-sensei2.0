import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JdMatch from './pages/JdMatch';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <Router>
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<ResumeAnalysis />} />
          <Route path="/match" element={<JdMatch />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
