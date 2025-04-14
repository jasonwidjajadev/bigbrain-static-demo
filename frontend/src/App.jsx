/**
POST    /admin/auth/login                         /login
POST    /admin/auth/register                      /register
POST    /admin/auth/logout

GET     /admin/games                              /quiz/create
PUT     /admin/games                              /quiz/update
POST    /admin/game/:gameid/mutate - mutate a game's state (start/advance/end)
GET     /admin/session/:sessionid/status - get the current status for a game session
GET     /admin/session/:sessionid/results - gets the results for game session and what people's scores were

POST    /play/join/:sessionid - join an active session as a new player
GET     /play/:playerid/status - for the current session, the player can determine if its started or not
GET     /play/:playerid/question - for the current question that session is up to, this gets the details of the question
GET     /play/:playerid/answer - once the question timer is finished, returns the correct answer
PUT     /play/:playerid/answer - for the current session is up to, allows the player to submit their answer
GET     /play/:playerid/results - once a session has ended this allows players to collec the results of their performance nenchmarked against others
*/

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AuthLogin from './pages/auth/AuthLogin';
import AuthRegister from './pages/auth/AuthRegister';
import AuthLogout from './pages/auth/AuthLogout';
import Dashboard from './pages/Dashboard';

import QuizCreate from './pages/QuizCreate';
import QuizEdit from './pages/QuizEdit';

import QuizJoin from './pages/QuizJoin';
import QuizJoinViaURL from './pages/QuizJoinViaURL';

import HostGameLobby from './pages/host/HostGameLobby';
import HostGamePlay from './pages/host/HostGamePlay';
import HostGameResults from './pages/host/HostGameResults';

import PlayerGameLobby from './pages/player/PlayerGameLobby';
import PlayerGamePlay from './pages/player/PlayerGamePlay';
import PlayerGameResults from './pages/player/PlayerGameResults';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. Home + Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/logout" element={<AuthLogout />} />

          {/* 2. Dashboard + Quizzes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path='/quiz/edit/:quizId' element={ <QuizEdit/>} />
          {/* <Route path='/quiz/edit/:quizId/:questionId' element={ <QuizEditQuestion/>} /> */}

          {/* 3.1 Host + Player*/}
          <Route path='/quiz/join' element={ <QuizJoin/>} />
          {/* 3.2 Player choose name*/}
          <Route path='/quiz/join/:sessionId' element={ <QuizJoinViaURL/>} />

          {/* 4. Host Game Session */}
          <Route path='/host/lobby/:sessionId' element={ <HostGameLobby/>} />
          <Route path='/host/play/:sessionId' element={ <HostGamePlay/>} />
          <Route path='/host/results/:sessionId' element={ <HostGameResults/>} />

          {/* 5. Player Game Session */}
          <Route path='/quiz/lobby/:sessionId' element={ <PlayerGameLobby/>} />
          <Route path='/quiz/play/:sessionId' element={ <PlayerGamePlay/>} />
          <Route path='/quiz/results/:sessionId' element={ <PlayerGameResults/>} />

          {/* <Route path='/quiz/join/:sessionId' element={ <QuizPlay/>} /> */}
          {/* <Route path='/lobby' element={ <Lobby/>} /> */}
          {/* <Route path='/quiz/play/:sessionid' element={ <ActiveQuiz/>} /> */}
          {/* <Route path='/results' element={ <AdminResults/>} /> */}
          {/* <Route path='/game/results/:sessionid' element={ <GameResults/>} /> */}

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App