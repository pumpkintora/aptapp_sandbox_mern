import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthProvider'
import axios from 'axios'

const Homepage = () => {
    const { user } = React.useContext(AuthContext)
    const navigate = useNavigate()

    React.useEffect(() => {
        axios.get('http://localhost:6969/auth').then((res) => {
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