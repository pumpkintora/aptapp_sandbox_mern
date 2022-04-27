import React from 'react'
import { useNavigate } from 'react-router-dom'
import TokenContext from '../../context/TokenProvider'
import axios from 'axios'

const Homepage = () => {
    const { token } = React.useContext(TokenContext)
    const navigate = useNavigate()

    React.useEffect(() => {
        axios.post('http://localhost:6969/', { token: token })
            .then(res => console.log(res))
    })

    return (
        <>
            <h1>Welcome to Homepage which is only visible when you are logged in </h1>
        </>
    )
}
export default Homepage