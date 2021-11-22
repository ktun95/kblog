import React, { useState, useEffect } from 'react'; 
import axios from 'axios'

export const Entry = (props) => { //title, text, coordinates
    const { selected } = props
    console.log(selected)
    const [isEditable, setIsEditable] = useState(false)
    const [images, setImages] = useState([])

    useEffect(() => {
        getPostImages(selected._id)
    }, [])
    
    const getPostImages = async postId => {
        let response = await axios({
            method: 'get', 
            url: `/api/posts/${postId}`
        })
        setImages(response.data.images)
    }
    
    const renderPostContents = (contentsArray) => {
        console.log('rendering post contents', images)
        return contentsArray.map((item, idx) => {
            if (typeof item === 'number') {
                if (images && images[item]) {
                    return (<img key={idx} src={images[item]}></img>)
                } else {
                    //placeholder element here. A grey box, maybe?
                }
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