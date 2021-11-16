import React, { useState } from 'react'; 

export const Entry = (props) => { //title, text, coordinates
    const { selected } = props
    console.log(selected)
    const [isEditable, setIsEditable] = useState(false)
    const [image, setImages] = useState([])

    
    const renderPostContents = (contentsArray) => {
        return contentsArray.map((item, idx) => {
            if (item.slice(0,10) === 'data:image') {
                return (<img key={idx} src={item}></img>)
            } else {
                return (<p key={idx}>{item}</p>)
            } 
        })
    }
    
    return (
        <div
            onBlur={() => console.log('leaving textarea')}
        >
            <h2>{props.selected.title}</h2>
            {renderPostContents(selected.postContents)}
        </div>
    )
}