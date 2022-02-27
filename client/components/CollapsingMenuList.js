import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Collapse,
    ListItemButton,
    ListItemIcon,
    ListItemText } from '@mui/material'

export const CollapsingMenuList = props => {
    const [open, setOpen] = useState(true)
    let navigate = useNavigate()

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <div>
            <ListItemButton onClick={handleClick}>
                <ListItemText>
                    Countries
                </ListItemText>
            </ListItemButton>
            <Collapse in={open}>
                {Object.keys(props.routes).map(route => {
                    return (
                        <ListItemButton onClick={() => navigate(props.routes[route])}>
                            <ListItemText primary={route} key={route} />
                        </ListItemButton>
                        // <ListItemButton onClick={navigate(routes[South Korea])}>
                        //     <ListItemText primary={route} key={route} />
                        // </ListItemButton>
                    )
                })}
            </Collapse>
        </div>
    )
}