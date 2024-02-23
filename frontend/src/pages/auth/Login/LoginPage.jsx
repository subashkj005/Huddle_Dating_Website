import React, { useContext, useState } from "react";
import "../../../assets/styles/authStyles.css";
import img from "../../../assets/front-image.jpg";
import logo from "../../../assets/images/logo_png_hd-cropped.png";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { PUBLIC_URL } from "../../../constants/urls";
import axiosInstance from "../../../axios/axiosInstance";
import { LoadingContext } from "../../../context/LoadingContext";
import { useDispatch } from "react-redux";
import { loggedIn } from "../../../redux/slices/logSlice";
import { UserPictureContext } from "../../../context/UserPictureContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {handleFetch} = useContext(UserPictureContext)
  const { showLoading, hideLoading } = useContext(LoadingContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Form
    if (!email || !password) {
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    showLoading();
    axiosInstance
      .post(`${PUBLIC_URL}/login`, data)
      .then((res) => {
        if (res.status == "200") {
          dispatch(loggedIn(res.data.user));
          navigate("user");
        }
      })
      .catch((err) => {
        console.log("login error", err);
        setErrorMessage(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message
        );
      })
      .finally(() => {
        hideLoading();
        handleFetch()
      });

    setErrorMessage("");
  };

  return (
    <div className="container">
      <div className="left-sec">
        <div className="left-image">
          <img src={img} alt="" />
        </div>
      </div>
      <div className="right-sec">
        <div className="right-box">
          <div className="logo-box">
            <img src={logo} alt="" />
          </div>
          <div className="center-box">
            <div className="outer">
              <div className="input-box">
                <label htmlFor="email">Email Address</label>
                <input
                  htmlFor="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="links-box">
                <p className="forgot-link">
                  <Link to="/forgot">Forgot Password ?</Link>
                </p>
              </div>
              <div className="button-box">
                <button onClick={handleSubmit}>Login</button>
                <div className="new-user-box">
                  <Link to="/signup">New User ?</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="google-box"></div>
          {errorMessage && (
            <Alert onClose={() => setErrorMessage("")} severity="warning">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
