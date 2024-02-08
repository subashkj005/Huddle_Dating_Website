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
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import AdminOTP from "./pages/admin/otp/AdminOTP";
import { ADMIN_AUTH } from "./constants/admin_urls";
import NewFile from "./pages/user/Profile/NewFile";
import InitialAuth from "./utils/route_auth/InitialAuth";
import UserAuthRoute from "./utils/route_auth/UserAuthRoute";
import AdminAuthRoute from "./utils/route_auth/AdminAuthRoute";
import Layout from "./components/commonContent/Layout";
import Chat from "./pages/user/ChatPage/Chat";

function App() {
  return (
    <LoadingProvider>
      <HashLoadingScreen />

      <div className="App">
        <ToastContainer hideProgressBar={true} autoClose={3000} />
        <Toaster position="bottom-center" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<InitialAuth />}>
              {/* User Auth*/}
              <Route index element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="signup/otp" element={<OTPVerification />} />
              {/* Admin  Auth*/}
              <Route path="adminAuth">
                <Route index element={<AdminLogin />} />
                <Route path="signup/otp" element={<AdminOTP />} />
                <Route path="signup" element={<AdminRegister />} />
              </Route>
            </Route>
            {/* User Routes */}
            <Route path="user" element={<UserAuthRoute />}>
              <Route element={<Layout />}>
                <Route index element={<UserHome />} />
                <Route path="chat/:chatName" element={<Chat />} />
                <Route path="image" element={<NewFile />} />
              </Route>
              <Route path="profile" element={<UserProfile />} />
            </Route>
            {/* Admin */}
            <Route path="admin" element={<AdminAuthRoute />}>
              <Route index element={<AdminHome />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </LoadingProvider>
  );
}

export default App;
