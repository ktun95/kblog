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
    
    const handleSubmit = () => {
        const imgWidth = imageRef.current.offsetWidth
        const imgHeight = imageRef.current.offsetHeight
        const imgOffsetLeft = imageRef.current.offsetLeft
        const imgOffsetTop = imageRef.current.offsetTop
        const viewPaneOffsetLeft = viewPaneRef.current.offsetLeft
        const viewPaneOffsetTop = viewPaneRef.current.offsetTop
        const scale = imageRef.current.naturalWidth / imgWidth
        console.log(scale)

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
        const currentEntry = document.getElementById("text-input")
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
            <EditorControls handleSubmit={handleSubmit}/> 
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
    const { handleSubmit } = props
    return (
        <div style={{zIndex: "1", backgroundColor: "black", height: "12.5%", padding: "10px"}}>
            <Button color="secondary" fullWidth={true} onClick={handleSubmit}> Done </Button>
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

function thisFunctionShoulBeCallByTheFileuploaderButton(e){
    e.preventDefault && e.preventDefault();
    var image, canvas, i;
    var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
    if(images && images.length) {
        for(i in images) {  
            if(typeof images[i] != 'object') continue;
            image = new Image();
            image.src = createObjectURL(images[i]);
            image.onload =  function(e){
                var mybase64resized = resizeCrop( e.target, 200, 150 ).toDataURL('image/jpeg', 90);
                alert(mybase64resized);
            }
        }           
    }
}

function resizeCrop( src, width, height ){
//if the provided (desired) width OR height is 0, crop = TRUE, 0 value means... don't change that value?
    var crop = width == 0 || height == 0;

    // not resize -- if height is to remain the same, but the width is to become larger or remain the same
    // th and height of the canvas AspectRatio on the dimensions of the src
    // But if the entered width argument is larger, set it to the source's width? 
    if(src.width <= width && height == 0) {
        height = src.height;
    }
    // resize -- in order to keep the proportions consistent, the height should be multiplied 
    // by the new width / original. but why change 
    if( src.width > width && height == 0){
        height = src.height * (width / src.width);
    }

    // check scale
    var xscale = width  / src.width;
    var yscale = height / src.height;
    // if we need to crop the image, the scaling value should be the smaller of the xscale or yscale
    // if cropping is unnecessary, the scaling value should be the larger of the two
    var scale  = crop ? Math.min(xscale, yscale) : Math.max(xscale, yscale);

    // create empty canvas
    var canvas = document.createElement("canvas");                  
    // Was a desired width or height specified? If not, the corresponding dimension should initially 
    canvas.width  = width ? width   : Math.round(src.width  * scale);
    canvas.height = height ? height : Math.round(src.height * scale);
    canvas.getContext("2d").scale(scale,scale);

    // crop it top center
    canvas.getContext("2d").drawImage(src, ((src.width * scale) - canvas.width) * -.5 , ((src.height * scale) - canvas.height) * -.5 );
    return canvas;
}

function createObjectURL(i){ 
    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    return URL.createObjectURL(i);
}
