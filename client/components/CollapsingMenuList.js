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
                {Object.keys(props.countries).map(c => {
                    return (
                        <ListItemButton key={c} onClick={() => navigate(props.countries[c])}>
                            <ListItemText primary={c} key={c} />
                        </ListItemButton>
                    )
                })}
            </Collapse>
        </div>
    )
}