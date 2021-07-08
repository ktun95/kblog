import React, { useState } from 'react';
import { SwipeableDrawer } from '@material-ui/core';

const toggleDrawer = (props) => {

}

export const Drawer = (props) => {
    const [isOpen, setIsOpen] = useState(true)
    // const toggleDrawer = (bool) => {
    //     setIsOpen(bool)
    // }
    return(
        <SwipeableDrawer
            open={isOpen}
            // onOpen={toggleDrawer(true)}
            // onClose={toggleDrawer(false)}>
            >
            {props.content}
        </SwipeableDrawer>
    )
}
