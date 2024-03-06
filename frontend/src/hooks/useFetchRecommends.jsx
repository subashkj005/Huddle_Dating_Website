import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../axios/axiosInstance";
import { USERS_URL } from "../constants/urls";
import { socketConnection } from "../socket/socketConfig";


function useFetchRecommends() {

  const [data, setData] = useState([]);
  const [account, setAccount] = useState([]);
  const batchNumber = useRef(1) //Initially it will be 1, when increment it will act as desired value
  const [isLimitReached, setLimitReached] = useState(false)
  const [fetchCompleted, setFetchCompleted] = useState(false)
  const [accountIndex, setAccountIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.logUser.user.id);


  const getRecommendations = async (fetchParams  = null) => {
    try {
      const res = await axiosInstance.get(
        `${USERS_URL}/recommendations/${userId}`, { params: fetchParams } 
      );
      return res?.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
  };

  const fetchMoreUsers = async () => {
    batchNumber.current = batchNumber.current + 1
    const fetchParams  = {
        batch_number: batchNumber.current,
        batch_size: 10
    }
    const fetchedUsers = await getRecommendations(fetchParams)
    setData((prevData)=> [...prevData, ...fetchedUsers])

    if (fetchedUsers?.length < 10) {
        setLimitReached(true)
    }else {
        setLimitReached(false)
    }
    
  };

  useEffect(() => {
    socketConnection()
    
    const fetchData = async () => {
      try {
        setFetchCompleted(false)
        const recommendations = await getRecommendations();
        setFetchCompleted(true)

        setData(recommendations);
        setAccount(recommendations && recommendations[0]);
        setAccountIndex(1)
        setLoading(true)
  
        if (recommendations?.length < 10){
            setLimitReached(true)
        }else{
            setLimitReached(false)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
    
    

  },[]);

  return [
    data, 
    setData, 
    account, 
    setAccount, 
    isLimitReached, 
    setLimitReached,
    accountIndex,
    setAccountIndex,
    loading,
    fetchMoreUsers,
    fetchCompleted]
}

export default useFetchRecommends;
