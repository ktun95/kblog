import React, { useState, useEffect } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { Autocomplete,
         Button,
         IconButton,
         TextField,
         Dialog,
         DialogActions,
         DialogContent,
         DialogTitle } from '@mui/material'
import { PublishOutlined, Save, Delete, Map } from '@mui/icons-material'
import axios from 'axios'
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {v4 as uuidv4 } from 'uuid'
// const DraftModal = ({ action, dialogState, setDialogState }) => {

//     const handleClose = () => {
        
//     }

//     return (
//         <Dialog open={dialogState} onClose={handleClose}>
            
//         </Dialog>
//     )
// }


const LocationDialog = ({
        open,
        onClose,
        handleCloseLocationDialog,
        handleConfirmLocation,
        location,
        setLocation }) => {
    const [searchString, setSearchString] = useState('')
    const [predictions, setPredictions] = useState([])    
    const [selected, setSelected] = useState({})
    // const sessionToken = uuidv4
    
    const displayPlacePredictions = async (string) => {
        console.log('displayPlacePredictions')
        
        if (!string || (string && string.length < 1)) return
        
        try {
            const service = new google.maps.places.AutocompleteService()
            await service.getPlacePredictions({input: string}, (predictionsObject)=> setPredictions(predictionsObject)) 
        } catch (err) {
            console.error(err.message, '\n', err.stack)
        }
    }

    const handleInputChange = e => {
        console.log('handle INPUT change', e)
        if (e) setSearchString(e.target.value)
    }

    const handleChange = (e, val) => {
        setSelected(val)
    }
    
    useEffect(() => {
        displayPlacePredictions(searchString)
        
        return (
            console.log(predictions)
        )
    }, [searchString])

    return (
        <Dialog fullWidth   open={open} onClose={onClose}>
            <DialogTitle>Location</DialogTitle>
            <DialogContent>
                <Autocomplete
                    autoFocus
                    // margin="dense"
                    // id="name"
                    label="Place"
                    // type="email"
                    // autoComplete='off'
                    freeSolo={true}
                    // size={medium}
                    // variant="standard"
                    // value={searchString}
                    // inputValue={searchString}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    options={predictions || []}
                    getOptionLabel={options => options.description}
                    renderInput={(params) => <TextField {...params} fullWidth label="Place" variant="standard" />}
                />
                {/* <IconButton>
                    <Map />
                </IconButton> */}
            {/* <ul>
                {predictions.map(p => <li>{p.description}</li>)}
            </ul> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseLocationDialog}>Cancel</Button>
                <Button onClick={() => { handleConfirmLocation(selected) }}>OK</Button>
                {/* <Button onClick={() => handleSubmit(dialogAction.ACTION_TITLE === 'Publish' ? {publish: true} : {publish: false})}>{dialogAction.ACTION_TITLE}</Button> */}
            </DialogActions>    
        </Dialog>
    )
}

export const WritePage = ({ entry = {}, initialDialogState = false }) => {
    
    const dialogActions = {
        'save': { ACTION_TITLE: 'Save', ACTION_ICON: Save },
        'publish': { ACTION_TITLE: 'Publish', ACTION_ICON: PublishOutlined }
    }
    
    const [ entryTitle, setEntryTitle ] = useState(entry.title || '')
    const [ location, setLocation ] = useState({})
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ openLocationDialog, setOpenLocationDialog ] = useState(false)
    const [ openDialog, setOpenDialog ] = useState(initialDialogState)
    const [ dialogAction, setDialogAction ] = useState(dialogActions['save'])


    const handleEditorStateChange = (editorState) => {
        setEditorState( prevState => editorState)
    }

    const handleSaveModal = () => {
        setDialogAction(dialogActions['save'])
        setOpenDialog(true)
    }
 
    const handlePublishModal = () => {
        setDialogAction(dialogActions['publish'])
        setOpenDialog(true)
    }

    const handleLocationModal = () => {
        setOpenLocationDialog(true)
    }

    const handleCloseLocationDialog = () => {
        setOpenLocationDialog(false)
    }
    
    const handleConfirmLocation = async (locationObj) => {
        const geocoder = new google.maps.Geocoder()
        const geocode = await geocoder.geocode({placeId: locationObj.place_id})
        const data = geocode.results[0]
        
        data.full_address = locationObj.description
        data.geometry.location.lat = data.geometry.location.lat()
        data.geometry.location.lng = data.geometry.location.lng()
        
        console.log(data)
        setLocation(data)
        handleCloseLocationDialog()
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
    const handleChange = e => {
        console.log(entryTitle)
        setEntryTitle(e.target.value)
    }

    const handleSubmit = async ({ publish = false }) => {
        const newEntry = {
            title: entryTitle,
            location,
            postContents: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            publish
        }
        
        console.log(newEntry)
        const req = await axios({
            method: 'post',
            url: '/api/posts',
            data: newEntry
        })

        handleCloseDialog()
        console.log(req)
    }

    // useEffect(() => {
    //     console.dir(convertToRaw(editorState.getCurrentContent()))
    //     console.dir(editorState.getCurrentContent())
    // })

    return(
        <React.Fragment>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem'}}>
                    <input 
                        id="entry-title"
                        value={entryTitle}
                        onChange={handleChange}
                        placeholder="Untitled"
                        >    
                    </input>
                    <a onClick={handleLocationModal} style={{alignSelf: 'center', textDecoration: 'underline'}}>{ location.full_address || 'Choose Location'}</a>
                </div>
                <LocationDialog
                    open={openLocationDialog}
                    onClose={handleCloseLocationDialog}
                    handleCloseLocationDialog={handleCloseLocationDialog}
                    handleConfirmLocation={handleConfirmLocation}
                    location={location}
                    setLocation={setLocation} />
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{dialogAction.ACTION_TITLE}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            // margin="dense"
                            // id="name"
                            label="Title"
                            // type="email"
                            fullWidth
                            variant="standard"
                            value={entryTitle}
                            onChange={handleChange}
                        />
                    </DialogContent>                    
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={() => handleSubmit(dialogAction.ACTION_TITLE === 'Publish' ? {publish: true} : {publish: false})}>{dialogAction.ACTION_TITLE}</Button>
                    </DialogActions>    
                </Dialog>
                <Editor
                    editorState={editorState}
                    wrapperClassName='editor-wrapper'
                    editorClassName='editor' 
                    onEditorStateChange={handleEditorStateChange}
                />
                {/* <textarea value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} style={{width: '100%', height: '40rem'}}
                /> */}
                <Button startIcon={<Delete />}> Delete </Button>
                <Button startIcon={<Save />} onClick={handleSaveModal}> Save </Button>
                <Button startIcon={<PublishOutlined />} onClick={handlePublishModal}> Publish </Button>
        </React.Fragment>
    )
}
