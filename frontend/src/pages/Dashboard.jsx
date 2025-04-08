import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import config from '../../backend.config.json';

function Dashboard() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('bigbrain_token');
    if (!token) {
      navigate('/home');
      //TODO a nice graceful error
    }
  }, []);

  //TODO API Get request of all games
  // async function loadGames() {...}
  //

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
        //TODO for mobile 1 rem padding
        // padding: '0.5rem 1rem',
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
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Link
            to="/quiz/create"
            style={{
              border: '2px solid grey',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              background: '#efefef',
              color: 'black',
            }}
          >
            Create
          </Link>
          <Link
            to="/auth/logout"
            style={{
              border: '2px solid grey',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              background: '#efefef',
              color: 'black',
            }}
          >
            Log out
          </Link>
        </div>

      </nav>

      {/* Games Feed */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}>
        <div
          // style={{
          //   display: 'flex',
          //   justifyContent: 'space-between',
          //   padding: '0.5rem 2rem',
          //   textAlign: 'center',
          //   alignItems: 'center',
          //   maxWidth: '1024px',
          // }}
        >
          <h1 style={{ alignSelf:'start', marginBottom:"1rem"}} >My Games</h1>
          {/* <Link
            to="/quiz/create"
            style={{
              border: '2px solid grey',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
              background: '#efefef',
              color: 'black',
            }}
          >
            Create
          </Link> */}
          {/* <div style={{ display: 'flex', justifyContent: 'evenly', gap: '10px'}}>
            <div style={{ width: "265px", height: "399px", background:"white", borderRadius: '5px', border: "1px solid grey"}}>
              <div style={{ width: "265px", height: "180px", background:"grey"}}></div>
            </div>
            <div style={{ width: "265px", height: "399px", background:"white", borderRadius: '5px', border: "1px solid grey"}}>
              <div style={{ width: "265px", height: "180px", background:"grey"}}></div>
            </div>
            <div style={{ width: "265px", height: "399px", background:"white", borderRadius: '5px', border: "1px solid grey"}}>
              <div style={{ width: "265px", height: "180px", background:"grey"}}></div>
            </div>
            <div style={{ width: "265px", height: "399px", background:"white", borderRadius: '5px', border: "1px solid grey"}}>
              <div style={{ width: "265px", height: "180px", background:"grey"}}></div>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

