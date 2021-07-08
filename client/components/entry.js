import React, { useState } from 'react'; 

export const Entry = (props) => { //title, text, coordinates
    //array of image URLs
    console.log("rendering entry...")
    const [image, setImages] = useState([])
    
    return (
        <React.Fragment>
            <h2>{props.selected.title}</h2>
            <p>{props.selected.text}}</p>
        </React.Fragment>
    )
}