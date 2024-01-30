import React from 'react'
import axiosInstance from '../axios/axiosInstance'
import { USERS_URL } from '../constants/urls'
import { useSelector } from 'react-redux';


function useInterest() {

    const userId = useSelector((state) => state.logUser.user.id);

    
    const handleLike = async (likedId) => {
        try {
            const data = {
                'liked_id': likedId
            };
    
            const response = await axiosInstance.post(`${USERS_URL}/like/${userId}`, data);
            console.log(response.data.message);
        } catch (error) {
            console.error(error);
        } 
    };

    const handleDislike = async (dislikedId) => {
        try {
            const data = {
                'disliked_id': dislikedId
            };

            const response = await axiosInstance.post(`${USERS_URL}/dislike/${userId}`, data)
            console.log(response.data.message)
        } catch (error) {
            console.log(error)
        }
    }

  return [handleLike, handleDislike]
}

export default useInterest