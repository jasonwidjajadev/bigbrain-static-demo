/**
POST    /admin/auth/login                         /login
POST    /admin/auth/register                      /register
POST    /admin/auth/logout

GET     /admin/games                              /quiz/create
PUT     /admin/games                              /quiz/update
POST    /admin/game/:gameid/mutate
GET     /admin/session/:sessionid/status
GET     /admin/session/:sessionid/results
                                                 /join
POST    /play/join/:sessionid                    /play/:id
GET     /play/:playerid/status
GET     /play/:playerid/question
GET     /play/:playerid/answer
PUT     /play/:playerid/answer
GET     /play/:playerid/results
*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Home from "./pages/Home";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import AuthLogout from "./pages/AuthLogout";
import Dashboard from "./pages/Dashboard";
import QuizCreate from "./pages/QuizCreate";
import QuizJoin from "./pages/QuizJoin";
import NotFound from "./pages/NotFound";
import QuizEdit from "./pages/QuizEdit";
import QuestionEditor from "./component/QuestionEditor";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Home + Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/logout" element={<AuthLogout />} />

          {/* Dashboard + Quizzes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path="/quiz/edit/:quizId" element={<QuizEdit />} />
          <Route
            path="/quiz/edit/:quizId/:questionId"
            element={<QuestionEditor />}
          />

          {/* Quiz Play */}
          {/* <Route path='/quiz/play/:sessionid' element={ <ActiveQuiz/>} /> */}
          <Route path="/quiz/join" element={<QuizJoin />} />
          {/* <Route path='/quiz/join/:sessionId' element={ <QuizPlay/>} /> */}
          {/* <Route path='/lobby' element={ <Lobby/>} /> */}

          {/* Quiz Results */}
          {/* <Route path='/results' element={ <AdminResults/>} /> */}
          {/* <Route path='/game/results/:sessionid' element={ <GameResults/>} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
