import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from 'react-router-dom';
import axios from 'axios';  
import { Main, Login } from './components';
import { createTheme, ThemeProvider } from '@mui/material/styles'

const UserContext = createContext(null)


const theme = createTheme({
    palette: {
        primary: {
            main: '#ffcc80'
        }
        // secondary：
    }
})



const App = () => {
    //replace with context later maybe, don't forget to make
    const [user, setUser] = useState('')  
    //corresponding change in the useEffect
    
    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios({
                method: 'get',
                url: '/auth'
            })
        setUser(data.username)
        }

        fetchUser()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path='*' element={<Main user={user} setUser={setUser} />} />
            </Routes>
        </ThemeProvider>
    )
}

ReactDOM.render(
    <Router>
        <App />
    </Router>,  
    document.getElementById('app')
)

window.scrollTo(0,1);
