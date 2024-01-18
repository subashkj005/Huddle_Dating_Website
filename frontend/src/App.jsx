import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext";
import LoginPage from "./pages/auth/Login/LoginPage";
import SignupPage from "./pages/auth/Signup/SignupPage";
import OTPVerification from "./pages/auth/OTPVerification/OTPVerification";
import UserProfile from "./pages/user/Profile/UserProfile";
import UserHome from "./pages/user/Home/UserHome";
import AdminLogin from "./pages/admin/login/AdminLogin";
import AdminHome from "./pages/admin/home/AdminHome";
import AdminRegister from "./pages/admin/register/AdminRegister";
import HashLoadingScreen from "./components/loadingScreen/HashLoadingScreen";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import AdminOTP from "./pages/admin/otp/AdminOTP";
import { ADMIN_AUTH } from "./constants/admin_urls";

function App() {
  return (
    <LoadingProvider>
      <HashLoadingScreen />
      <div className="App">
        <ToastContainer hideProgressBar={true} autoClose={3000} />
        <Toaster position="bottom-center" reverseOrder={false}/>
        <Router>
          <Routes>
            <Route path="/">
              {/* User */}
              <Route index element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="signup/otp" element={<OTPVerification />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="home" element={<UserHome />} />
              {/* Admin */}
              <Route path="admin">
                <Route index element={<AdminLogin />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="signup" element={<AdminRegister />} />
                <Route path="signup/otp" element={<AdminOTP />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </div>
    </LoadingProvider>
  );
}

export default App;
