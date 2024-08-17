import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Space from './components/Space.jsx';
import AuthCallback from './util/AuthCallback.jsx';
import './App.css';

import {
  Router,
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
} from 'react-router-dom';
function App() {
  return (
    // <HashRouter>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/space/:id" element={<Space />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
