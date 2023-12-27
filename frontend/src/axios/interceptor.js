import axiosInstance from "./axiosInstance";


axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        const {response} = error
        
        if (response) {
            if (response.status === 401) {
                console.log('Interceptor: Unauthorized access');
            }
            if (response.status === 403) {
                console.log('Interceptor: Forbidden request');
                
            }
        }
    }
)