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

function PlayerGameEnterName() {
  //TODO green theme
  return (
    <>
    PlayerGamePlay
    </>
  )
}
export default PlayerGameEnterName;

