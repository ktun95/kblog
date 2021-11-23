import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles'
import { Button, Menu, MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "center"
    },
    blogTitle: {
        fontWeight: "normal"
    }, 
    titleAdjacent: {
        flex: "1"
    }
})

export const Header = (props) => {
    const {selected, setSelected, isWriteMode, setIsWriteMode, toggleWriteMode} = props

    const [anchorEl, setAnchorEl] = useState(null)

    const classes = useStyles()
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = (cb) => {
        setAnchorEl(null);
        if (typeof cb === "function") cb()
    };
    
    const newPost = () => {
        toggleWriteMode()
        console.log('write mode:', isWriteMode)
        setSelected({postContents:[]})
    }

    const editPost = () => {
        setIsWriteMode(true)
    }

    return (
        <div className={classes.header}>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
            =
        </Button>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose}>All Posts</MenuItem>
            {isWriteMode ? null
             : <MenuItem onClick={() => {handleClose(editPost)}}>Edit Current</MenuItem>}
            <MenuItem onClick={() => {handleClose(newPost)}}>{isWriteMode ? 'Back' : 'New'}</MenuItem>
        </Menu>
            <div className={classes.titleAdjacent}></div>
            <h1 className={classes.blogTitle}> Kady's Travels </h1>
            <div className={classes.titleAdjacent}>instagram: @kadylam_</div>
        </div>
    )
}