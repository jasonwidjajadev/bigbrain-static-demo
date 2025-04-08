import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'

    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #eee',
      }}>
        <Link to="/home"
          style={{
            textDecoration: 'none',
            color: 'purple',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}>Big Brain 🧠
        </Link>
        <Link
          to="/quiz/join"
          style={{
            border: '2px solid grey',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            background: '#efefef',
            color: 'black',
          }}
        >
          Join a game
        </Link>
      </nav>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'purple', }}>Big Brain 🧠</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Link
            to="/auth/login"
            style={{
              border: '2px solid grey',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              background: '#efefef',
              color: 'black',
            }}
          >
            Log in
          </Link>
          <Link
            to="/auth/register"
            style={{
              border: '2px solid grey',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              background: '#efefef',
              color: 'black',
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
