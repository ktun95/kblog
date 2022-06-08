import React from 'react'
import { AppBar, Toolbar, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const MyAppBar = ({toggleDrawer, isDrawerOpen, drawerWidth}) => {
    const theme = useTheme() 

    return (
        <AppBar sx={{marginLeft: (isDrawerOpen ? `${drawerWidth}` : 0),
                     transitionProperty: "margin",
                     transitionDuration: `${theme.transitions.duration.leavingScreen}ms`,
                     transitionTimingFunction: theme.transitions.easing.sharp,
                    }}
                position="relative">
            <Toolbar>
                <Button 
                    variant="text"
                    color="inherit"
                    onClick={toggleDrawer}
                    sx={{ ...(isDrawerOpen && {display: "none"}) }} > = </Button>
                <h1>Kady's Travels</h1>
            </Toolbar>
        </AppBar> 
    )
}