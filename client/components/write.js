import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import axios from 'axios'
import { makeStyles, IconButton, Input } from '@material-ui/core'
import { Create, Image, Save } from '@material-ui/icons'
import { Entry } from '../interfaces/entry'
import { ImageEditor } from '.'
// import { getUserLocation } from '../functions/navigator'

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
    },
    //action: {}
})

// [] needs logic to make the first line a title if user deletes it
export const Write = (props) => {
    const [titleValue, setTitleValue] = useState('')
    const [userCoordinates, setUserCoordinates] = useState([])
    const [entryArray, setEntryArray] = useState([])
    const [isImageEditing, setIsImageEditing] = useState(false)
    
    const inputSpace = useRef(null)

    useEffect(()=> {
        document.execCommand('defaultParagraphSeparator', false, "p")
    }, [])

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

    const handleInput = e => {
        //if user presses enter to start a new paragraph, update state, save to server
        if (e.target.value === 'enter' && inputSpace.current) {

        }
    }

    const updateEntryState = () => {
        inputSpace.current
    }

    const handleFileChange = e => {
        // console.log(e.target.files[0])
        console.log("User uploading image")
        setIsImageEditing(URL.createObjectURL(e.target.files[0]))
        // console.log(newImage)
        // inputSpace.current.appendChild(newImage)
    }

    const createImgElement = src => {
        const img = document.createElement('img')
        newImage.src = URL.createObjectURL(src)
        return img
    }

    const saveEntry = async () => {
        //get strings from  paragraphs imgs
        const title = document.getElementById('title').value;
        const postContents = []
        const images = []
        let imageCount = 0
        
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
        //create entry obj
        const newEntry = new Entry(title, userCoordinates, postContents, images)
        //post request with obj
        const req = await axios({
            method: 'post',
            url: '/api/posts/',
            data: newEntry
        })

        console.log(req.status)
    }

    const classes = useStyles()

    return(
        <React.Fragment>
            <div className={classes.metadata}>
                {userCoordinates}
            </div>
            <input
                type="text"
                id="title" 
                placeholder="Title..."
                autocomplete="off"
                // value={titleValue}
                // onChange={handleChange}
                style={{border: "0px", fontSize: "18px"}}
            ></input>
            <div id="post-content" contentEditable="true" ref={inputSpace}>
                <p>...</p>
            </div>
            {/* <button onClick={toggleImageEditor} className={classes.save}/> */}
            {/* <input type="button" onClick={saveEntry} className={classes.save}></input> */}
            <FloatingButtonGroup styles={{bottom: "2rem", right: "2rem"}}>
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
            {isImageEditing ? <ImageEditor src={isImageEditing} setIsImageEditing={setIsImageEditing}/> : null}
        </React.Fragment>
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

/*
===image upload behavior===
[x]user can upload multiple files at a time
[x] user can scale and position image with an (simple) instagram style editing interface
[]image files will appear in the content container div as the user expects it will appear to the audience
    -maybe by default, just add it to the end
image's position in relation to other images or text elements should be persistent
rendered image can be repositioned inuitively
    -change in position will be recorded
? save updated object entry after image upload? dont want to have to do that again 
 */