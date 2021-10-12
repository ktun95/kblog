import React, { useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'

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
    const {src} = props
    const [aspectRatio, setAspectRatio] = useState([4, 3]) //width : height
    console.log('rendering Image Editor')
    
    return (
        //should render a frame of acceptable dimensions
        //change this to flexbox
        <div id="image-editor" style={{position: "fixed", top: "0", left: "0", display: "flex", flexDirection: "column", height: "100vh", width: "100vw"}}>
            <EditorFrame aspectRatio={aspectRatio} src={src} />
            <div id="editor-backdrop" style={{position: "fixed", top: "0", left: "0", height: "100vh", width: "100vw", backgroundColor: "grey"}}></div>
            <EditorControls />
        </div>
    )
    //render the source image behind the frame
    // the source image should be able to be translated
        // [x] and scaled by the user
    // on confirmation, return an appropriately cropped and scaled version of the source image to the parent component, which should then create an img element in the correct place  
}

const EditorFrame = props => {
    const {aspectRatio, src} = props
    const width = window.innerWidth
    const height = width * aspectRatio[1] / aspectRatio[0]
    const viewPane = useRef(null)
    
    // useEffect(() => { //can this adaptable to window resizing for desktop?
    //     console.log(`setting viewPane dimensions | width: ${width}, height: ${height}`)
    //     console.dir(viewPane.current)
    //     viewPane.current.style.width = width;
    //     viewPane.current.style.height = height;
    // }, [aspectRatio])

    const classes = useStyles()

    return (
        <div id="editor-frame" style={{display: "flex", flexGrow: "1", flexDirection: "column", zIndex: "1", overflow: "hidden"}}>
            <div id="frame-top" className={classes.frameStile}></div>
            <div id="frame-middle" style={{display: "flex", flexDirection: "row"}}>
                <div id="frame-left" className={classes.frameStile}></div>
                    <div id="view-pane" style={{height: `${height}px`, width: `${width}px`, overflow: "hidden"}}>
                        <AdjustableImage src={src} width={width} />
                    </div>
                <div id="frame-right" className={classes.frameStile}></div>
            </div>
            <div id="frame-bottom" className={classes.frameStile}></div>
        </div>
    )
}

const EditorControls = props => {
    return (
        null
    )
}

export const AdjustableImage = props => {
    // const [position, setPosition] = useState({left: 0, top: 0})
    const imageRef = useRef(null)
    const {src, height, width} = props

    let prevX, prevY;
    let prevDiff = -1
    let originalAspectRatio, originalX, originalY;
    let moveCount = 0

    useEffect(() => {
        originalAspectRatio = imageRef.current.width / imageRef.current.height 
        // originalX = imageRef.current.X
        // originalY = imageRef.current.Y
    }, [])

    // useEffect(()=> {    
    //     if (imageRef.current) {
    //         console.dir(imageRef)
    //         imageRef.current.addEventListener('touchmove', handleTouchMove, {passive: true})
    
    //         return (
    //             imageRef.current.removeEventListener('touchmove', handleTouchMove)
    //         )
    //     }
    // }, [])

    const handleTouchStart = e => {
        console.log(e.touches)
        console.dir(e.target)
        
        if (e.touches.length == 1) {
            prevX = e.touches[0].clientX
            prevY = e.touches[0].clientY
            console.log(prevX, prevY)
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
            console.log('====START=====')
            console.log('target top: ', e.target.style.top)
            console.log('cycle: ', moveCount++)
            
            console.dir(e.target)  
            console.log('image current location [e.target.y]: ', e.target.y)
            console.log('change in touch position: ', e.touches[0].clientY - prevY)
            const newX = e.target.offsetLeft + e.touches[0].clientX - prevX  
            const newY = e.target.offsetTop + e.touches[0].clientY - prevY
            //newcord  = currentImgLocation + (difference in current mvmt pos and last mvmt pos)
            console.log('calculated new image position', newX)
            e.target.style.left = `${newX}px`
            e.target.style.top = `${newY}px`
            
            prevX = e.touches[0].clientX
            prevY = e.touches[0].clientY
            console.log('====END=====')
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
                e.target.height = e.target.width / originalAspectRatio
            }
            prevDiff = currentDiff
        }
        //
    }

    const handleTouchEnd = e => {
        e.target.style.opacity = '100%'
        if (e.touches.length < 2) {
            prevDiff = -1 
        }
        moveCount = 0
        // if (e.touches.length < 1) {
            
        // }
    }

    return (
        <img
            style={{position: "absolute", zIndex: "1"}}
            width={width}
            height={height}
            ref={imageRef}
            {...props}
            src={src}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
    // th and height of the canvas AspectRatioon the dimensions of the src
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
