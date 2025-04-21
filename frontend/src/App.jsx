import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from '@/context/AuthContext';

import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';

import AuthLogin from '@/pages/auth/AuthLogin';
import AuthRegister from '@/pages/auth/AuthRegister';
import AuthLogout from '@/pages/auth/AuthLogout';

import Dashboard from '@/pages/Dashboard';
import QuizCreate from '@/pages/quiz/QuizCreate';
import QuizEdit from '@/pages/quiz/QuizEdit';
import QuestionEditor from '@/pages/quiz/QuestionEditor';
import QuizResults from '@/pages/quiz/QuizResults'

import JoinGame from '@/pages/session/JoinGame';
import JoinGameViaURL from '@/pages/session/JoinGameViaURL';

import HostGameView from '@/pages/session/host/HostGameView';
import PlayerGameView from '@/pages/session/player/PlayerGameView';
import InactiveGame from '@/pages/session/InactiveGame';

/**
 * App is the root component that sets up routing and global auth context.
 *
 * - Uses BrowserRouter for client-side routing.
 * - Wraps the app with AuthProvider for authentication state.
 * - Defines all public, auth, admin, and gameplay routes.
 *
 * @returns {JSX.Element} App with all defined routes and context
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/logout" element={<AuthLogout />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path='/quiz/edit/:quizId' element={ <QuizEdit/>} />
          <Route path='/quiz/edit/:quizId/:questionId' element={ <QuestionEditor/>} />
          <Route path='/quiz/results/:quizId' element={ <QuizResults/>} />

          <Route path='/join' element={ <JoinGame/>} />
          <Route path='/join/:sessionId' element={ <JoinGameViaURL/>} />
          <Route path='/play/:sessionId' element={ <PlayerGameView/>} />

          <Route path="/host/:sessionId" element={<HostGameView />} />
          <Route path='/session/inactive' element={ <InactiveGame/>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App