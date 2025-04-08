// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import config from '../../backend.config.json';
import { Link } from 'react-router-dom';

function AdminQuizCreate() {

  return <>
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

      <div
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
        <h1 style={{ marginBottom: '1rem' }}>Quiz Dashboard</h1>

      </div>
    </div>
  </>;
}
export default AdminQuizCreate;

