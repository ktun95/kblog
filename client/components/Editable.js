import React, { useState } from 'react'

//This component should take a react component and make the elements of that component editable in a WYSIWYG fashion
export const Editable = (props) => { //component
    const [data, setData] = useState(props.children) 

    return (
        <div contentEditable="true">
            {props.children}
        </div> 
    )
}