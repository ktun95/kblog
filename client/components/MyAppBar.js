import React from 'react'
import { AppBar, Toolbar, Button } from '@mui/material'

export const MyAppBar = props => {
    const { toggleDrawer } = props
    
    return (
        <AppBar position="relative">
            <Toolbar>
                <Button variant="text" color="inherit" onClick={toggleDrawer}> = </Button>
                <h1>Kady's Travels</h1>
            </Toolbar>
        </AppBar> 
    )
}