// pages
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages_simple/homepage'
// react-router-dom
import { Navigate, useRoutes } from 'react-router-dom'
// hooks
import { useState, useContext } from 'react';
// context
import AuthContext from './context/AuthProvider';

export default function Router() {
    const { user } = useContext(AuthContext)
    return useRoutes([
        {
            path: '/',
            // element: <Homepage />,
            children: [
                { path: '/', index: true, element: <Homepage /> },
                { path: '/login', element: <Login /> },
                { path: '/register', element: <Register />},
            ]
        },
        // {
        //     path: '/login',
        //     element: <Login />
        // },
        // {
        //     path: '/register',
        //     element: <Register />
        // },
    ])
}