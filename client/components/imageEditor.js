import React, { useState, useRef, useEffect } from 'react'

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


export const ImageEditor = props => { //srcImage, maybe viewport size
    const {src} = props
    const [aspectRatio, setAspectRatio] = useState([4, 3]) //width : height
    console.log('rendering Image Editor')
    
    return (
        //should render a frame of acceptable dimensions
        //change this to flexbox
        <React.Fragment>
            <EditorFrame aspectRatio={aspectRatio} />
            <EditorControls />
        </React.Fragment>
    )
    //render the source image behind the frame
    // the source image should be able to be translated
        // [x] and scaled by the user
    // on confirmation, return an appropriately cropped and scaled version of the source image to the parent component, which should then create an img element in the correct place  
}

const EditorFrame = props => {
    const {aspectRatio, src} = props
    const width = window.innerWidth * .9
    const height = width * aspectRatio[1] / aspectRatio[0]
    const viewPane = useRef(null)
    
    useEffect(() => { //can this adaptable to window resizing for desktop?
        console.log(`setting viewPane dimensions | width: ${width}, height: ${height}`)
        console.dir(viewPane.current)
        viewPane.current.style.width = width;
        viewPane.current.style.height = height;
    }, [aspectRatio])

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                height: "70vh",
                width:  "100vw",
                overflow: 'hidden'
                // opacity: "10%",
                // backgroundColor: "black"
            }
        }>
            <div 
                id="view-pane"
                ref={viewPane}
                style={{
                        position: "absolute",
                        zIndex: "3",
                        backgroundColor: "green",
                        margin: "auto",
                        top: "3rem",
                        height: `${height}px`,
                        width: `${width}px`,
                        // opacity: "50%",
                        // backgroundColor: "green",
                        boxShadow: '5px 5px 0px 1000px, -5px 5px 0px 1000px, 5px -5px 0px 1000px, -5px -5px 0px 1000px'
                    }
                }
            >
            <AdjustableImage src={"/images/test/tree.jpg"}/> 
            </div>
        
        </div>
    )
}

const EditorControls = props => {
    return (
        null
    )
}

export const AdjustableImage = props => {
    const imageRef = useRef(null)
    const {src} = props

    let prevDiff = -1
    let originalAspectRatio, originalX, originalY;

    useEffect(() => {
        originalAspectRatio = imageRef.current.width / imageRef.current.height 
        // originalX = imageRef.current.X
        // originalY = imageRef.current.Y
    }, [])

    const handleTouchStart = e => {
        console.log(e.touches)
        if (e.touches.length == 2) {
            e.target.style.opacity = '50%'
            prevDiff = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
        }
    }

    const handleTouchMove = e => {
        if (e.touches.length == 1) { 
            
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
    }

    return (
        <img
            // style={{position: "absolute", zIndex: "1"}}
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