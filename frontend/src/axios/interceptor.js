import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./axiosInstance";
import { Navigate } from "react-router-dom";
import { loggedOut } from "../redux/slices/logSlice";


const user = useSelector((state) => state.logUser.user);
const dispatch = useDispatch();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    console.log('error at the interceptor = ', error)

    const { response } = error;

    if (response) {
      if (response.message) {
        console.log(
          "RES_ERR ==",
          response.message,
          "STATUS_CODE =",
          response.status
        );
      } else if (response.error) {
        console.log(
          "RES_ERR ==",
          response.error,
          "STATUS_CODE =",
          response.status
        );
      }

      if (response.status === 401) {
        console.log('interceptor catched the 401 error')
        if (user.role === "user") {
          window.location.href = '/';
        } else if (user.role === "admin") {
          window.location.href = '/adminAuth';
        } else {
          window.location.href = '/';
        }

        dispatch(loggedOut);
        console.log("Interceptor: Unauthorized access");
      } else if (response.status === 403) {
        if (user.role === "user") {
          <Navigate to="/user" />;
        } else if (user.role === "admin") {
          <Navigate to="/admin" />;
        }

        console.log("Interceptor: Forbidden request");
      } else if (response.status === 500) {
        console.log("INTERCEPTOR == INTERNAL SERVER ERROR");
      }
    }
    return Promise.reject(error);
  }
);
