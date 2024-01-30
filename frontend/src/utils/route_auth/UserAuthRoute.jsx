import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function UserAuthRoute() {

    const user = useSelector(state => state.logUser.user)
    if (!user) {
        <Navigate to="/" />
    } else if (user.role === "admin") {
        <Navigate to="/admin" />
    }else {
        return <Outlet/>
    }
}

export default UserAuthRoute