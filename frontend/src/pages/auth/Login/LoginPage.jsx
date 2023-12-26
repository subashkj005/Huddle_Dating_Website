import React, {useState} from 'react'
import  '../../../assets/styles/authStyles.css'
import img from '../../../assets/front-image.jpg'
import logo from '../../../assets/images/logo_png_hd-cropped.png'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import { PUBLIC_URL, USERS_URL } from '../../../constants/urls'
import { isPasswordStrongEnough } from '../../../utils/auth/passwordStrength'




function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const isPasswordStrong = isPasswordStrongEnough(password)

    const navigate = useNavigate()

    const checkPassword = (value) => {
        setPassword(value)
        setErrorMessage(isPasswordStrong.message);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate Form
        if (!email || !password){
            return
        }

        const data = {
            email: email,
            password: password
        }

        axios.post(`${PUBLIC_URL}/login`, data)
        .then(res=>{
            console.log('login success', res)
            if (res.status == '200') {
                navigate('home')
            }
            
            
        })
        .catch(err=>{
            console.log('login error',err)
            setErrorMessage(err?.response?.data?.detail)
        })

        setErrorMessage("")
    }

  return (
    <div className="container" >
            <div className="left-sec" >
                <div className="left-image">

                    <img src={img} alt="" />
                </div>
            </div>
            <div className="right-sec">
                <div className="right-box">
                     <div className="logo-box">
                        <img src={logo} alt=""/>
                     </div>
                     <div className="center-box" >
                        <div className="outer">
                            <div className="input-box">
                                <label for="email">Email Address</label >
                                <input type="text" value={email} onChange={e=>setEmail(e.target.value)} />
                            </div>
                            <div className="input-box">
                                <label for="password">Password</label>
                                <input type="password" value={password} onChange={e=>checkPassword(e.target.value)}/>
                            </div>
                            <div className="links-box">
                                <p className="forgot-link">
                                    <Link to="/forgot">Forgot Password ?</Link>
                                </p>
                            </div>
                            <div className="button-box">
                                <button onClick={handleSubmit} >Login</button>
                                <div className="new-user-box">
                                    <Link to="/signup">New User ?</Link>
                                </div>
                            </div>
                        </div>
                     </div>
                     <div className="google-box"></div>
                     {errorMessage && (
                    // <Alert onClose={() => setErrorMessage("")} severity={!isPasswordStrong.strongEnough ? "warning" : "success"}>
                    //     {errorMessage}
                    // </Alert>
                    <Alert onClose={() => setErrorMessage("")} severity="warning">
                        {errorMessage}
                    </Alert>
                    )}
                </div>
            </div>
        </div>
  )
}

export default LoginPage