import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { Container,
         TextField, 
         Button } from '@mui/material'
import axios from 'axios'
// import { makeStyles } from '@mui/styles'

// const useStyles = makeStyles({
//     textField: {
//         display: 'block'
//     }
// })

export const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorString, setErrorString] = useState('')

    const handleChange = (e, cb) => {
        cb(e.target.value)
    }
    
    const login = async () => { 
        if (!username || !password) {
            setErrorString('Please enter username and password')
        } 

        const response = await axios({
            method: 'post',
            url: '/auth/login',
            data: {
                username,
                password
            }
        })
        
        await props.setUser(response.data.username)
    }

    console.log('rendering Login')
    // const classes = useStyles()
    return (
        props.user ? 
            <Redirect to='/' /> : 
            <Container>
                <div>
                    <TextField label="Username" required={true} onChange={(e) => handleChange(e, setUsername)}>{username}</TextField>
                </div>
                <div>
                    <TextField label="Password" required={true} onChange={(e) => handleChange(e, setPassword)}>{password}</TextField>
                </div>
                <Button onClick={login}>Log In</Button>
                <span></span>
            </Container>  
    )
}