import React, { useState, useRef, useEffect } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles({
    frameStile: {
        opacity: "50%",
        backgroundColor: "black",
        flexGrow: 1,
        flexBasis: "auto",
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderStyle: "inset",
        zIndex: "999"
    }
})

export const ImageEditor = props => { //srcImage, maybe viewport size
    const imageRef = useRef(null)
    const viewPaneRef = useRef(null)
    const [aspectRatio, setAspectRatio] = useState([4, 3]) //width : height
    const {src, setIsImageEditing} = props
    const width = window.innerWidth
    const height = width * aspectRatio[1] / aspectRatio[0]
    
    const getImageUrl = (cb) => {
        const imgWidth = imageRef.current.offsetWidth
        const imgHeight = imageRef.current.offsetHeight
        const imgOffsetLeft = imageRef.current.offsetLeft
        const imgOffsetTop = imageRef.current.offsetTop
        const viewPaneOffsetLeft = viewPaneRef.current.offsetLeft
        const viewPaneOffsetTop = viewPaneRef.current.offsetTop
        const scale = imageRef.current.naturalWidth / imgWidth

        if (imgWidth + imgOffsetLeft < width + viewPaneOffsetLeft
            || imgHeight + imgOffsetTop < height + viewPaneOffsetTop
            || imgOffsetLeft > viewPaneOffsetLeft
            || imgOffsetTop > viewPaneOffsetTop) {
                console.log(`invalid image position\n
                             image doesnt span frame width? ${imgWidth + imgOffsetLeft <= width + viewPaneOffsetLeft}\n
                             image doesnt span frame height? ${imgHeight + imgOffsetTop <= height + viewPaneOffsetTop}\n
                             image begins past frame left? ${imgOffsetLeft > viewPaneOffsetLeft}\n
                             image begins past frame top? ${ imgOffsetTop > viewPaneOffsetTop} \n
                             Image Width:        ${imgWidth} \n
                             Image Height:       ${imgHeight} \n
                             Image Offset Left   ${imgOffsetLeft} \n
                             Image Offset Top    ${imgOffsetTop} \n
                             ViewPane Offset Left${viewPaneOffsetLeft} \n
                             ViewPane Offset Top ${viewPaneOffsetTop} \n
                             ViewPane Width      ${width} \n
                             ViewPane Height     ${height} \n
                             `)
                
                return
        }
        //Create a canvas or use a canvas 
        // !! problem with canvas, does it necessarily generate an image with the inherent dimensions determined by the current device? as long as it has the correct aspect ratio it can be scaled up for other viewport sizes right? make larger by default
        const canvas = document.getElementById("image-format")
        const canvasContext = canvas.getContext("2d")
        //Draw the image with the current size and dimensions. 
        //possibly can use current dimensions of user edited image, so programmatically calculating appropriate size to draw might not be necessary
        console.log({dx: viewPaneOffsetLeft - imgOffsetLeft,
                     dy: viewPaneOffsetTop - imgOffsetTop })
        canvasContext.drawImage(imageRef.current,                    //source parameters need to be scaled to proportion of original img size : element size
                                scale * (viewPaneOffsetLeft - imgOffsetLeft),  //sx
                                scale * (viewPaneOffsetTop - imgOffsetTop),    //sy
                                scale * width, scale * height,                 //sHeight, sWidth
                                0, 0,                                          //dx, dy
                                width, height)                 //dHeight, dWidth
        //create URL from canvas
        const result = canvas.toDataURL()
        //append onto write component 
        const newImg = document.createElement('img')
        newImg.setAttribute("width", width)
        newImg.setAttribute("src", result)
        newImg.style.margin = "-1rem"
        const currentEntry = document.getElementById("post-content")
        currentEntry.appendChild(newImg)
        //send data to server
        console.log("success!")
        setIsImageEditing(false) 
    }

    return (
        <div id="image-editor" style={{position: "fixed", top: "0", left: "0", display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
            <div style={{backgroundColor: "black", height: "12.5%", zIndex: "2"}}></div>
            <canvas id="image-format" style={{display: "none"}} width={width} height={height}></canvas>
            <EditorFrame aspectRatio={aspectRatio}
                         src={src}
                         width={width}
                         height={height}
                         viewPaneRef={viewPaneRef}
                         imageRef={imageRef} />
            <div id="editor-backdrop" style={{position: "fixed", top: "0", left: "0", height: "100vh", width: "100vw", backgroundColor: "grey"}}></div>
            <EditorControls getImageUrl={getImageUrl}/> 
        </div>
    )
}

const EditorFrame = props => {
    const {aspectRatio, src, imageRef, viewPaneRef, width, height} = props
    const viewPane = useRef(null)

    const classes = useStyles()

    return (
        <div id="editor-frame" style={{display: "flex", flexGrow: "1", flexDirection: "column", zIndex: "1", overflow: "hidden"}}>
            <div id="frame-top" className={classes.frameStile}></div>
            <div id="frame-middle" style={{display: "flex", flexDirection: "row"}}>
                <div id="frame-left" className={classes.frameStile}></div>
                    <div id="view-pane" ref={viewPaneRef} style={{height: `${height}px`, width: `${width}px`, overflow: "hidden"}}>
                        <AdjustableImage src={src} width={width} imageRef={imageRef} /> {/* width prop is passed in */}
                    </div>
                <div id="frame-right" className={classes.frameStile}></div>
            </div>
            <div id="frame-bottom" className={classes.frameStile}></div>
        </div>
    )
}

const EditorControls = props => {
    const { getImageUrl } = props
    return (
        <div style={{zIndex: "1", backgroundColor: "black", height: "12.5%", padding: "10px"}}>
            <Button color="secondary" fullWidth={true} onClick={getImageUrl}> Done </Button>
        </div>
    )
}

export const AdjustableImage = props => {
    const {src, height, width, imageRef} = props

    let prevX, prevY;
    let prevDiff = -1
    let originalAspectRatio, originalX, originalY;

    // useEffect(() => {
    //     console.log("original aspect ratio: ", {image: imageRef.current,
    //         clientHeight: imageRef.current.clientHeight, 
    //         clientWidth: imageRef.current.clientWidth, 
    //         aspectRatio: originalAspectRatio})
    //         console.log("clientHeight after ", imageRef.current.clientHeight )
    //     }, [])
        
        useEffect(()=> {    
        if (imageRef) {
            console.dir(imageRef)
            imageRef.current.addEventListener('touchstart', handleTouchStart)
            imageRef.current.addEventListener('touchmove', handleTouchMove, {passive: false})
            imageRef.current.addEventListener('touchend', handleTouchEnd)
            
            return (() => {
                imageRef.current.removeEventListener('touchstart', handleTouchStart)
                imageRef.current.removeEventListener('touchmove', handleTouchMove)
                imageRef.current.removeEventListener('touchend', handleTouchEnd)
            })
        }
    }, [])
    
    const handleTouchStart = e => {
        originalAspectRatio = imageRef.current.clientWidth / imageRef.current.clientHeight  
        
        if (e.touches.length == 1) {
            prevX = e.touches[0].clientX
            prevY = e.touches[0].clientY
        }

        if (e.touches.length == 2) {
            e.target.style.opacity = '50%'
            prevDiff = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
        }
    }

    const handleTouchMove = e => {
        e.preventDefault()
        e.stopPropagation()
       
        if (e.touches.length == 1) {
            const newX = Math.floor(e.target.offsetLeft + e.touches[0].clientX - prevX)  
            const newY = Math.floor(e.target.offsetTop + e.touches[0].clientY - prevY)

            e.target.style.left = `${newX}px`
            e.target.style.top = `${newY}px`
            
            prevX = e.touches[0].clientX
            prevY = e.touches[0].clientY
        }

        if (e.touches.length == 2) {
            //find difference of touch event clientX values
            let currentDiff = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
            if (prevDiff > 0) {
                //add or subtract the magnitude of the difference to the width of the image
                if (prevDiff < currentDiff) {
                    // pinch OUT, ADD
                    e.target.width+= currentDiff - prevDiff
                }
                if (prevDiff > currentDiff) {
                    e.target.width-=  prevDiff - currentDiff
                    // pinch IN, SUBTRACT
                }
                // adjust height proportionately 
                console.log(e.target.width, originalAspectRatio)
                e.target.height = e.target.width / originalAspectRatio
            }
            prevDiff = currentDiff
        }
        //
    }

    const handleTouchEnd = e => {
        console.log('touchEND')
        e.target.style.opacity = '100%'
        if (e.touches.length < 2) {
            prevDiff = -1 
        }
        // if (e.touches.length < 1) {
            
        // }
    }

    return (
        <img
            className="adjustable"
            style={{position: "absolute", zIndex: "1"}}
            // width={width}
            ref={imageRef}
            {...props}
            src={src}
        >
            
        </img>
    )
}

const appendToElement = (htmlElement) => () => {

} 
