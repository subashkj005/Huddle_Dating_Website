import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "../redux/slices/logSlice";

const axiosInstance = axios.create({
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { response } = error;

//     if (response) {
//       if (response?.status === 401 || response?.status === 403) {

//         const user = useSelector((state) => state.logUser.user);
//         const navigate = useNavigate()
//         const dispatch = useDispatch()

//         if (response.status === 401) {
//           console.log('interceptor catched the 401 error')
//           if (user?.role === "user") {
//             navigate('/')
//           } else if (user?.role === "admin") {
//             navigate('/adminAuth')
//           } else {
//             navigate('/')
//           }
  
//           dispatch(loggedOut);
//           console.log("Interceptor: Unauthorized access");
//         }
//       } else {
//         return Promise.reject(error);
//       }
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

export default axiosInstance;
