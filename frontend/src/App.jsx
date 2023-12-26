import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/auth/Login/LoginPage';
import SignupPage from './pages/auth/Signup/SignupPage';
import OTPVerification from './pages/auth/OTPVerification/OTPVerification';
import UserProfile from './pages/user/Profile/UserProfile';
import UserHome from './pages/user/Home/UserHome';



function App() {
  return (
    <div class="App">

      <Router>
        <Routes>
          
            <Route path='/'>
              <Route path='/' element={<LoginPage/>} />
              <Route path='signup' element={<SignupPage/>} />
              <Route path='signup/otp' element={<OTPVerification/>} />
              <Route path='profile' element={<UserProfile/>} />
              <Route path='home' element={<UserHome/>} />
            </Route>
         
        </Routes>
      </Router>

    </div>
  );
}

export default App;
