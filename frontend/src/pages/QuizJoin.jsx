import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import config from '../../backend.config.json';
import { Link } from 'react-router-dom';

function QuizJoin() {
  const [gameId, setGameId] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  async function joinGame() {
    setLoading(true);

    //TODO button should be disable until there is an input
    //TODO validation of input
    // if (!/^\d+$/.test(gameId)) {
    //   setErrorMessage('Game ID must be numeric.');
    //   setLoading(false);
    //   return;
    // }

    try {
      // TODO: Send gameId to backend here
      console.log('Joining game with ID:', gameId);
    } catch (err) {
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    joinGame();
  };

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 2rem',
        textAlign: 'center',
        alignItems: 'center',
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
      </nav>

      <form
        onSubmit={handleSubmit}
        aria-label="Join Game form"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ marginBottom: '1rem' }}>Enter Game ID</h1>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="gameId"
            name="gameId"
            aria-label="Game ID"
            placeholder="Game PIN"
            autoComplete="off"
            required
            value={gameId}
            onChange={(e) => {
              setGameId(e.target.value);
              setErrorMessage('');
            }}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '200px',
              textAlign: 'center',
            }}
          />
        </div>

        {/* Backend Error Message */}
        {errorMessage && (
          <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }} role="alert">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-label="Join game now"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            // background: '#4f46e5',
            // color: 'white',
            // border: 'none',
            // fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Joining...' : 'Join'}
        </button>

      </form>
    </div>
  );
}
export default QuizJoin;
