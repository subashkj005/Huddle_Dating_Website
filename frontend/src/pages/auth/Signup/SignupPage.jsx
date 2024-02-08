import React, { useState, useContext } from "react";
import "../../../assets/styles/authStyles.css";
import img from "../../../assets/front-image.jpg";
import logo from "../../../assets/images/logo_png_hd-cropped.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { PUBLIC_URL } from "../../../constants/urls";
import { isPasswordStrongEnough } from "../../../utils/auth/passwordStrength";
import HashLoadingScreen from "../../../components/loadingScreen/HashLoadingScreen";
import axiosInstance from "../../../axios/axiosInstance";
import { LoadingContext } from "../../../context/LoadingContext";


function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const { email, password, confirm_password } = formData;
  const [errorMessage, setErrorMessage] = useState();
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const isPasswordStrong = isPasswordStrongEnough(password);
  const navigate = useNavigate();

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (password && !isPasswordStrong.strongEnough) {
      setErrorMessage(isPasswordStrong.message);
    } else if (isPasswordStrong.strongEnough) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !confirm_password) {
      return;
    }

    if (confirm_password !== password) {
      setErrorMessage("Passwords do not match..!");
      return;
    }
    showLoading();

    axiosInstance
      .post(`${PUBLIC_URL}/signup`, formData)
      .then((res) => {
        console.log("login success", res);

        if (res.status == "200") {
          navigate("/signup/otp", { state: { email: email } });
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        console.log(err);
        setErrorMessage(err.response.data.message);
      })
      .finally(() => {
        hideLoading();
      });

    setErrorMessage("");
  };

  return (
    <>
      
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
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleValueChange}
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleValueChange}
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={confirm_password}
                      onChange={handleValueChange}
                    />
                  </div>
                  <div className="button-box">
                    <button onClick={handleSubmit}>Sign up</button>
                    <div className="new-user-box">
                      <Link to="/">Already User ?</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="google-box"></div>
              {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
            </div>
          </div>
        </div>
      
    </>
  );
}

export default SignupPage;
