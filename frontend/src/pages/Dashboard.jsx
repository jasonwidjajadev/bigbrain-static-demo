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



/*
2.2.1. Dashboard

A unique route must exist for this screen e.g. /dashboard

A dashboard of all games is displayed, where each game shows the title, number of questions it contains, a thumbnail, and a total duration to complete (sum of each individual question's duration)
Each game listed should have a clickable UI component relating to it that takes user to the screen to edit that particular game. E.G. /game/{game_id}

A button exists on this screen which brings up a UI component that allows user to create a new game, provide a name for the game. After a new game is created, it must be added to the dashboard immediately without a refresh.

🙉🙉🙉 (For pairs only) A button exists on this screen that brings up a UI component to allow user to delete a particular game.

================================================================================
2.2.2. Edit BigBrain Game

A unique route must exist for this screen that is parameterised on the game ID. E.G. /game/{game_id}

This screen allows users to select the question they want to edit
This screen allows users to DELETE a particular question and ADD a new question, all actions must be done without a refresh.

🙉🙉🙉 (For pairs only) This screen should also allow the editing of game meta data such as name and thumbnail

================================================================================

2.2.3. Edit BigBrain Game Question

A unique route must exist for this screen that is parameterised both on the Game ID and the question ID. E.G. /game/{game_id}/question/{question_id}

Editable items on this page include:

The question type (multiple choice, single choice, judgement)

Single choice questions have multiple answers the player can guess, ONLY one is correct
Multiple choice questions have multiple answers the player can guess, MULTIPLE are correct and they must select ALL correct ones
Judgement questions have a SINGLE answer the player can guess, the answer is either correct or incorrect


The question itself (as a string)
Time limit that users have to answer the question (as a number)
Points for how much the question is worth (as a number)
The ability to optionally attach a URL to a youtube video, or upload a photo, to enhance the question being asked.
Anywhere between 2 and 6 answers, each contains the answer as a string

* ==============================================================================

2.3.1. Starting a game session

On the dashboard page, users should be able to start a new game session via clicking a start game button.
When the game session is started, a popup is displayed that shows the session ID of the game as a string

This session ID should be able to be copied to clipboard by some kind of "Copy Link" UI component. When this item is clicked, a direct URL is copied to the clipboard. When going to this URL, the users should be given play screen (described in 2.4) with the session code already pre-populated.
After user started a game session, the UI should change appropriately to reflect that a game session is active for a particular game.
Note: Only one session of a game can be active at one time.


2.3.2. Stopping a game session

On the dashboard page, the ability to stop a started game session. Stopping a game session sends all active players to the results screen. A stopped session cannot be restarted.
When the game session is stopped, a popup appears that prompts the admin "Would you like to view the results?" If they clicked yes, they are taken to the screen described in 2.3.3



2.3.3. Advancing & getting the results of a game

A unique route must exist for this screen that is parameterised on the session ID. E.G. /session/{session_id}

If the game session hasn't finished, it should allow the admin to advance to the next question or stop the session. You can advance either in the middle of a question's duration counting down or once the question has time up.
Once the game session has finished, it should display the following:

A table of up to top 5 users and their score

A bar/line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct
A chart showing the average response/answer time for each question
Any other interesting information you see fit (Bonus mark can be granted for this based on your implementation)
 */