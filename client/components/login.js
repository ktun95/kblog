import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { Container,
         Box,
         Card,   
         CardContent,
         CardActions,
         TextField, 
         Button,
         Typography } from '@mui/material'
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
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [errorString, setErrorString] = useState('')

    const handleChange = (e, cb) => {
        cb(e.target.value)
    }
    
    const isValid = () => {
        if (username && password) return true

        if (!username) setUsernameError(true)
        if (!password) setPasswordError(true)

        return false
    }

    const login = async () => { 

        if (isValid()) {
            try {
                const response = await axios({
                    method: 'post',
                    url: '/auth/login',
                    data: {
                        username,
                        password
                    }
                })
            } catch (err) {
                console.error(err)
            }
        }

        
        await props.setUser(response.data.username)
    }

    console.log('rendering Login')
    // const classes = useStyles()
    return (
        props.user ? 
            <Redirect to='/' /> : 
            <Container maxWidth="sm">
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1">Login</Typography>
                        <TextField
                            id="username-input"
                            label="Username"
                            helperText={usernameError ? "Please enter your username" : " "}
                            error={usernameError}
                            autoFocus
                            fullWidth={true}
                            margin="dense"
                            size='small'
                            required={true}
                            onFocus={()=> setUsernameError(false)}    
                            onChange={(e) => handleChange(e, setUsername)}>
                                {username}
                        </TextField>                
                        <TextField
                            id="password-input"
                            label="Password"
                            helperText={passwordError ? "Please enter your password" : " "}
                            error={passwordError}
                            fullWidth={true}
                            margin="dense"
                            size='small'
                            required={true}
                            onFocus={()=> setPasswordError(false)}    
                            onChange={(e) => handleChange(e, setPassword)}>
                                {password}
                        </TextField>                
                    </CardContent>
                    <CardActions>
                        <Button onClick={login}>Log In</Button>
                    </CardActions>
                </Card>
            </Container>  
    )
}