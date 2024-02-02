import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loggedOut } from "../redux/slices/logSlice";

function useInterceptor() {
  const user = useSelector((state) => state.logUser.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleErrorResponse = (res) => {
    if (res.status === 401) {
      if (user.role === "user") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/adminAuth");
      } else {
        navigate("/");
      }
      dispatch(loggedOut);
    } else if (res.status === 403) {
      if (user.role === "user") {
        navigate("/user");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    }
  };

  return handleErrorResponse
}

export default useInterceptor;
