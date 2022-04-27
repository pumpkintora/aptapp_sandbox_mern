// pages
import Login from './pages/Login'
import Register from './pages_simple/register'
import Homepage from './pages_simple/homepage'
// react-router-dom
import { Navigate, useRoutes } from 'react-router-dom'
// hooks
import { useState, useContext } from 'react';
// context
import TokenContext from './context/TokenProvider';

export default function Router() {
    const { token } = useContext(TokenContext)
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