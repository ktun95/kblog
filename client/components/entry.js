import React, { useState } from 'react'; 

export const Entry = (props) => { //title, text, coordinates
    const [isEditable, setIsEditable] = useState(false)
    const [image, setImages] = useState([])
    
    
    return (
        <div
            onBlur={() => console.log('leaving textarea')}
        >
            <h2>{props.selected.title}</h2>
            <p>{props.selected.text}</p>
        </div>
    )
}