import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios'
import { makeStyles, IconButton, Input } from '@material-ui/core'
import { Create, Image, Save } from '@material-ui/icons'
import { EntryObj } from '../interfaces/entry'
import { ImageEditor } from '.'

export const Entry = (props) => { //title, text, coordinates
    const { selected, isWriteMode, setIsWriteMode } = props
    
    const [titleValue, setTitleValue] = useState('')
    const [userCoordinates, setUserCoordinates] = useState([])
    const [entryArray, setEntryArray] = useState([])
    const [isImageEditing, setIsImageEditing] = useState(false)
    // const [writeMode, setWriteMode] = useState(false)
    const [images, setImages] = useState([])

    const inputSpace = useRef(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(pos) {
            const {latitude, longitude} = pos.coords
            setUserCoordinates([latitude, longitude])
        }), function (err) {
            console.warn(`ERROR(${err.code}): ${err.message}`)
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }}, [])
    
    useEffect(()=> {
        document.execCommand('defaultParagraphSeparator', false, "p")
    }, [])

    useEffect(() => {
        if (selected._id) {
            getPostImages(selected._id)
        }
    }, [])
    
    const getPostImages = async postId => {
        let response = await axios({
            method: 'get', 
            url: `/api/posts/${postId}`
        })
        setImages(response.data.images)
    }

    const saveEntry = async () => {
        //get strings from  paragraphs imgs
        console.log("Initiating saveEntry()")
        const title = document.getElementById('title').value;
        const postContents = []
        const images = []
        let imageCount = 0
        let req
        console.log("Variables defined")

        document.querySelectorAll('#post-content *').forEach( e => {
            if (e.tagName === 'P') {
                postContents.push(e.innerText)
            }
            
            if (e.tagName === 'IMG') {
                postContents.push(imageCount)
                images.push(e.src)
                imageCount++
            }

        })
        console.log('postContents array filled')

        //create entry obj
        const newEntry = new EntryObj(title, userCoordinates, postContents, images)
        //post or update request with obj
        console.log('Entry object created: ', newEntry)
        if (selected._id) {
            req = await axios({
                method: 'put',
                url: `/api/posts/${selected._id}`,
                data: newEntry
            })
        } else {
            req = await axios({
                method: 'post',
                url: '/api/posts/',
                data: newEntry
            })
        }
        console.log(req)
    }
    
    const renderPostContents = (contentsArray) => {
        console.log('rendering post contents', images)
        if (contentsArray.length === 0) return (<p>Tell the world about your travels</p>)
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

    const handleFileChange = e => {
        setIsImageEditing(URL.createObjectURL(e.target.files[0]))
    }
    
    const classes = useStyles()
    
    return (
        <div
            onBlur={() => console.log('leaving textarea')}
        >

                        <div className={classes.metadata}>
                {`${userCoordinates[0]}, ${userCoordinates[1]}`}
            </div>
            <input
                type="text"
                id="title" 
                placeholder={selected.title || "Title"}
                autocomplete="off"
                disabled={!isWriteMode}
                // value={titleValue}
                // onChange={handleChange}
                style={{border: "0px", fontSize: "25px"}}
            ></input>
            <div id="post-content" contentEditable={isWriteMode} ref={inputSpace}>
                {renderPostContents(selected.postContents)}
            </div>
            {isWriteMode
             ? <FloatingButtonGroup styles={{bottom: "2rem", right: "2rem"}}>
                <input style={{display: "none"}} type="file" id="file-upload" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-upload">
                    <IconButton aria-label="file-upload" component="span">
                        <Image /> 
                    </IconButton>
                </label>
                <IconButton onClick={saveEntry}>
                    <Create />
                </IconButton>
            </FloatingButtonGroup>
             : null}
            {isImageEditing ? <ImageEditor src={isImageEditing} setIsImageEditing={setIsImageEditing}/> : null}


        </div>
    )
}

const FloatingButtonGroup = (props) => {
    const { flexDirection } = props 
    console.log(FloatingButtonGroup)
    
    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                gap: '2px',
                flexDirection: "column-reverse" || flexDirection,
                ...props.styles  
            }}
        >
            {props.children}
        </div>
    )
}

const useStyles = makeStyles({
    metadata: {
        display: 'flex',
        justifyContent: 'flex-end'
    }, 
    save: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '1.25rem',
        border: '0px',
        boxShadow: '3px 3px 3px grey'
    },
    fileUpload: {
        // position: 'absolute',
        // bottom: '2rem',
        // right: '2rem',
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '1.25rem',
        border: '0px',
        boxShadow: '3px 3px 3px grey'
    }
})