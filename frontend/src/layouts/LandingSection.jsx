import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingSection() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '80px auto', 
      padding: '4rem 1rem', 
      textAlign: 'center',
      background: '#fff',
      border: '4px solid #000',
      borderRadius: '24px',
      boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
    }}>
      <h2 style={{ 
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        fontWeight: 800,
        fontSize: '3rem', 
        marginBottom: '1rem',
        color: '#000',
        letterSpacing: '-0.02em'
      }}>
        Naukri Sensei Workflow
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#555', 
        marginBottom: '3rem',
        lineHeight: 1.6
      }}>
        Explore our AI Placement Prep System features. Analyze your resume, match against job descriptions, and discover jobs.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="magnetic"
          onClick={() => navigate('/analyze')}
          style={{
            padding: '1.2rem 2.5rem',
            fontSize: '1.1rem',
            background: '#000',
            color: '#fff',
            borderRadius: '12px',
            border: '2px solid #000',
            fontWeight: 'bold',
            flex: '1 1 200px',
            maxWidth: '300px',
            transition: 'transform 0.2s',
            fontFamily: "'DM Sans', 'Inter', sans-serif"
          }}
        >
          Analyze My Resume
        </button>

        <button
          className="magnetic"
          onClick={() => navigate('/match')}
          style={{
            padding: '1.2rem 2.5rem',
            fontSize: '1.1rem',
            background: '#fff',
            color: '#000',
            borderRadius: '12px',
            border: '3px solid #000',
            fontWeight: 'bold',
            flex: '1 1 200px',
            maxWidth: '300px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            transition: 'transform 0.2s',
            fontFamily: "'DM Sans', 'Inter', sans-serif"
          }}
        >
          Have a JD? Check Fit
        </button>
      </div>
    </div>
  );
}
