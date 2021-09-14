import React from 'react';
import { makeStyles } from '@material-ui/styles'

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
    const classes = useStyles()
    
    const handleClick = () => {
        props.toggleWriteMode()
    }

    return (
        <div className={classes.header}>
            <button onClick={handleClick}>=</button>
            <div className={classes.titleAdjacent}></div>
            <h1 className={classes.blogTitle}> Kady's Travels </h1>
            <div className={classes.titleAdjacent}>instagram: @kadylam_</div>
        </div>
    )
}