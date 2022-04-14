import React from 'react'
import { Drawer,
         Toolbar,
         Button,
        ListItemButton,
        ListItemText } from '@mui/material'
import { CollapsingMenuList } from '.'
import { useNavigate } from 'react-router-dom'

export const MyDrawer = props => {
    const { isDrawerOpen, toggleDrawer, routes } = props 
    const navigate = useNavigate()

    return (
        <Drawer anchor="left" open={isDrawerOpen} variant="persistent">
            <Toolbar>
                <Button variant="text" color="inherit" onClick={toggleDrawer}> = </Button>
            </Toolbar>
            <ListItemButton sx={{flexGrow: 0}}  key="Map" onClick={() => navigate('/map')}>
                <ListItemText primary="Map" key="Map" />
            </ListItemButton>
            <CollapsingMenuList countries={routes["Country"]} />
            <ListItemButton sx={{flexGrow: 0, justifyContent: "flex-end"}}  key="Drafts" onClick={() => navigate('/posts/drafts')}>
                <ListItemText primary="Drafts" key="Drafts" />
            </ListItemButton>
            <ListItemButton sx={{flexGrow: 0, justifyContent: "flex-end"}}  key="New" onClick={() => navigate('/new')}>
                <ListItemText primary="New+" key="New" />
            </ListItemButton>

        </Drawer>
    )
}