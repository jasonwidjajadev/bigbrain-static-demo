/**
 import { useLocation } from 'react-router-dom';

function PlayerGameEnterName() {
  const location = useLocation();
  const nickname = location.state?.nickname || localStorage.getItem('nickname');

  if (!nickname) {
    // Redirect back or show error
    navigate('/quiz/join');
  }

  // ...
}
*/


function HostGameLobby() {
  //1. Get the session Id from previous page

  //TODO disable host playing their own game
  // Host click start
  // Countdown 3 seconds
  // Display question
  return (
    <>
    HostGameLobby
    </>
  )
}
export default HostGameLobby;
