import { useNavigate } from 'react-router-dom';
import { loggedOut } from '../slices/logSlice';


export const asyncLogout = () => async (dispatch) => {
  try {
    const navigate = useNavigate();

    navigate('/'); // Redirect to the home page
    await dispatch(loggedOut()); // Dispatch the loggedOut action
  } catch (error) {
    console.error('Error during logout:', error);
    // Handle errors appropriately
  }
};