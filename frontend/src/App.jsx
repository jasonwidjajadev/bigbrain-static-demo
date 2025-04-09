/**
src
.
├── App.jsx
├── __test__
│   └── example.test.jsx
├── assets
│   └── react.svg
├── component
├── index.css
├── main.jsx
├── pages - if its a diff url
│   ├── AuthLogin.jsx
│   ├── AuthLogout.jsx
│   ├── AuthRegister.jsx
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── QuizCreate.jsx
│   └── QuizJoin.jsx
├── setup.js
└── util

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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import AuthLogout from './pages/AuthLogout';
import Dashboard from './pages/Dashboard';
import QuizCreate from './pages/QuizCreate';
import QuizJoin from './pages/QuizJoin';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/logout" element={<AuthLogout />} />

          {/* TODO Get Request */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ================================================================ */}
          {/* TODO Can QuizCreate and Quiz Edit be the same code? but different url*/}
          <Route path="/quiz/create" element={<QuizCreate />} />

          {/* <Route path='/quiz/edit/:quizId' element={ <QuizEdit/>} /> */}
          {/* <Route path='/quiz/edit/:quizId/:questionId' element={ <QuizEditQuestion/>} /> */}

          {/* ================================================================ */}
          {/* <Route path='/quiz/play/:sessionid' element={ <ActiveQuiz/>} /> */}
          <Route path='/quiz/join' element={ <QuizJoin/>} />
          {/* <Route path='/quiz/join/:sessionId' element={ <QuizPlay/>} /> */}
          {/* <Route path='/lobby' element={ <Lobby/>} /> */}
          {/* <Route path='/results' element={ <AdminResults/>} /> */}
          {/* <Route path='/game/results/:sessionid' element={ <GameResults/>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

/*
  // const [count, setCount] = useState(0);

<div>
  <a href="https://vitejs.dev" target="_blank" rel="noreferrer noopener">
    <img src={viteLogo} className="logo" alt="Vite logo" />
  </a>
  <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
    <img src={reactLogo} className="logo react" alt="React logo" />
  </a>
</div>
<h1>Vite + React</h1>
<div className="card">
  <button id="counter" onClick={() => setCount((count) => count + 1)}>
    count is {count}
  </button>
  <p>
    Edit <code>src/App.jsx</code> and save to test HMR
  </p>
</div>
<p className="read-the-docs">
  Click on the Vite and React logos to learn more
</p>
*/