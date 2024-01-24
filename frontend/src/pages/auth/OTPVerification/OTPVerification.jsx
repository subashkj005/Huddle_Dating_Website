import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from '../../../assets/front-image.jpg'
import logo from '../../../assets/images/logo_png_hd-cropped.png'
import { Alert } from '@mui/material';
import axios from 'axios';
import { PUBLIC_URL } from '../../../constants/urls'
import { LoadingContext } from "../../../context/LoadingContext";
import {toast as hottoast} from 'react-hot-toast';

function OTPVerification() {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const [errorMessage, setErrorMessage] = useState();
  const location = useLocation()
  const email = location.state?.email
  const firstInputRef = useRef(null);
  const navigate = useNavigate()

  const handleInputChange = (index, value, isBackspace) => {
    const newOtpValues = [...otpValues];

    // Handle backspace
    if (isBackspace && index > 0) {
      newOtpValues[index - 1] = '';
      index -= 1;
    } else {
      newOtpValues[index] = value;
    }

    setOtpValues(newOtpValues);

    const nextIndex = index + 1;
    const inputs = document.querySelectorAll('.input-field input');

    if (nextIndex < otpValues.length && value !== '') {
      inputs[nextIndex].removeAttribute('disabled');
      inputs[nextIndex].focus();
    }

    if (value === '' && !isBackspace) {
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        inputs[prevIndex].setAttribute('disabled', true);
        inputs[prevIndex].value = '';
        inputs[prevIndex].focus();
      }
    }

    const allValueEntered = newOtpValues.every((val) => val !== '');

    if (allValueEntered) {
      document.querySelector('.btn').classList.add('active');
    } else {
      document.querySelector('.btn').classList.remove('active');
    }
  };

  const handleOTPVerification = (e) => {
    e.preventDefault();
    const joinedOTP = otpValues.join('');

    const data = {
      email: email,
      otp: joinedOTP,
    };

    showLoading();

    axios
      .post(`${PUBLIC_URL}/otp_confirm`, data)
      .then((res) => {
        console.log('otp success', res);
        setErrorMessage(res.data.message);
        hottoast.success('Account created successfully')
        navigate("/")
      })
      .catch((err) => {
        console.log(err, err.response.data.message);
        setErrorMessage(err.response.data.message);
        
      })
      .finally(() => {
        hideLoading();
      });

    setErrorMessage('');
  };

  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);


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
              <div className="wrapper-otp">
                <p className="text-center">
                  Enter OTP Code sent to
                  <br/>
                  {email}
                </p>
                <form method="POST" onSubmit={handleOTPVerification}>
                  <div className="input-field">
                    {otpValues.map((value, index) => (
                      <input
                        key={index}
                        type="number"
                        name={`otp${index + 1}`}
                        id={`otp${index + 1}`}
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        disabled={index > 0 && otpValues[index - 1] === ''}
                        ref={index === 0 ? firstInputRef : null}
                      />
                    ))}
                  </div>
                  <button
                    className={`btn btn-primary ${otpValues.every(val => val !== '') ? 'active' : ''}`}
                    type="submit"
                    value="verify otp"
                    style={{ marginTop: '1.6rem', borderRadius: '4px' }}
                  >
                    Verify OTP
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="google-box"></div>
          {errorMessage && (
                    <Alert severity="warning">
                        {errorMessage}
                    </Alert>
                    )}
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
