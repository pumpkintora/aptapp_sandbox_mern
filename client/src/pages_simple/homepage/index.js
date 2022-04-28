import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'
import axios from 'axios'

const Homepage = () => {
    const { user } = React.useContext(AuthContext)
    const navigate = useNavigate()

    React.useEffect(() => {
        // console.log(axios.defaults.headers.common["Authorization"])
        axios.post('http://localhost:6969/token/verify', {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmEwYmZhODVmMGMyY2Y5NTVjZmM4NyIsImVtYWlsIjoiZ3JrQGdyay5jb20iLCJpYXQiOjE2NTExMzIyNDksImV4cCI6MTY1MTEzMjI1OX0.k_CBwAAqIwmw8MhuW4I3kNXLxr7ACfN1T5-cfsBKSX5"
        }).then((res) => {
            console.log(res)
            if (res.status === 400) navigate('/login')
        })
    })

    return (
        <>
            <h1>Welcome to Homepage which is only visible when you are logged in </h1>
        </>
    )
}
export default Homepage