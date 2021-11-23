import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    container: {
        padding: "1rem",
        overflowY: "auto",
        height: "100%",
        maxWidth: "100%",
        // minWidth: "100%"
    }
})

export const ContentContainer = (props) => {
    const classes = useStyles()
    
    return (
        <div id="content-container" className={classes.container} onScroll={() => {console.log('map should close');props.setShowMap(false)}}
        >
            {props.children}
        </div>
    )
}