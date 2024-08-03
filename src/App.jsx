import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Space from './components/Space.jsx';
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
    // <HashRouter basename={process.env.PUBLIC_URL}>
    <HashRouter>
      {/* <BrowserRouter> */}
      {/* <div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/space" element={<Space />} />
      </Routes>
      {/* </div> */}
    </HashRouter>
  );
}
export default App;
