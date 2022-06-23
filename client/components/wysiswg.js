import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { Autocomplete,
         Button,
         IconButton,
         TextField,
         Dialog,
         DialogActions,
         DialogContent,
         DialogTitle,
         Typography } from '@mui/material'
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


const PlaceDialog = ({
        open,
        onClose,
        handleClosePlaceDialog,
        handleConfirmPlace,
        place,
        setPlace }) => {
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
        if (val) setSelected(val)
    }
    
    useEffect(() => {
        displayPlacePredictions(searchString)
        
        return (
            console.log(predictions)
        )
    }, [searchString])

    return (
        <Dialog fullWidth   open={open} onClose={onClose}>
            <DialogTitle>Place</DialogTitle>
            <DialogContent>
                <Autocomplete
                    // id="name"
                    label="Place"
                    freeSolo={true}
                    // size={medium}
                    // variant="standard"
                    // value={searchString}
                    // inputValue={searchString}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    options={predictions || []}
                    getOptionLabel={options => options.description || searchString}
                    renderInput={(params) => <TextField {...params} autoFocus fullWidth label="Place" variant="standard" />}
                />
                {/* <IconButton>
                    <Map />
                </IconButton> */}
            {/* <ul>
                {predictions.map(p => <li>{p.description}</li>)}
            </ul> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClosePlaceDialog}>Cancel</Button>
                <Button onClick={() => { handleConfirmPlace(selected) }}>OK</Button>
                {/* <Button onClick={() => handleSubmit(dialogAction.ACTION_TITLE === 'Publish' ? {publish: true} : {publish: false})}>{dialogAction.ACTION_TITLE}</Button> */}
            </DialogActions>    
        </Dialog>
    )
}


async function fetchPostData(id) {
    const req = await axios({
        method: 'get',
        url: `/api/posts/${id}`
    })
    return req.data
}

export const WritePage = ({ entry = {}, entries, setEntries, initialDialogState = false }) => {
    const dialogActions = {
        'save': { ACTION_TITLE: 'Save', ACTION_ICON: Save },
        'publish': { ACTION_TITLE: 'Publish', ACTION_ICON: PublishOutlined }
    }
    
    const {postId} = useParams()
    let existingEntry = {};
    
    //Currently, refreshing on a page with a postId parameter will cause the app to crash due to the initial render having an uninitialized entries state. 
    //The editorState useState call attempts to call createWithContent on undefined, before the post data has a chance to be fetched. This will do for now.
    (async function() {
        existingEntry = entries.find((entry) => entry._id === postId) || await fetchPostData(postId) || {}
    })()

    console.log(existingEntry)
    
    const [ entryTitle, setEntryTitle ] = useState(existingEntry.title || '')
    const [ currentEntry, setCurrentEntry ] = useState(entry)
    const [ place, setPlace ] = useState({})
    const [ editorState, setEditorState ] = useState(existingEntry ? EditorState.createWithContent(convertFromRaw(existingEntry.postContents)) : EditorState.createEmpty() )
    const [ openPlaceDialog, setOpenPlaceDialog ] = useState(false)
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false)
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

    const handlePlaceModal = () => {
        setOpenPlaceDialog(true)
    }

    const handleClosePlaceDialog = () => {
        setOpenPlaceDialog(false)
    }
    
    const handleConfirmPlace = async (placeObj) => {
        const newPlace = {
            full_address: placeObj.description
        }

        const geocoder = new google.maps.Geocoder()

        try {
            const geocode = await geocoder.geocode({placeId: placeObj.place_id})
            const data = geocode.results[0]
            
            newPlace.address_components = data.address_components
            newPlace.formatted_address = data.formatted_address
            newPlace.coordinates = {lat: data.geometry.location.lat(), lng: data.geometry.location.lng()}
            
            setPlace(newPlace)
            handleClosePlaceDialog()
        } catch (err) {
            console.error(err)
        } 
        
        // data.geometry.location.lat = data.geometry.location.lat()
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
    const handleChange = e => {
        console.log(entryTitle)
        setEntryTitle(e.target.value)
    }

    const handleSubmit = async ({ publish = false }) => {
        const newEntryForm = {
            title: entryTitle,
            place,
            postContents: convertToRaw(editorState.getCurrentContent()),
            publish
        }
        
        const req = await axios({
            method: 'post',
            url: '/api/posts',
            data: newEntryForm
        })

        const newEntryId = req.data.insertedId

        const newEntryReq = await axios({
            method: 'get',
            url: `/api/posts/${newEntryId}`
        })
        const newEntry = newEntryReq.data
        setCurrentEntry(newEntry)
        setEntries(prevEntries => [...prevEntries, newEntry])
        handleCloseDialog()
    }

    const handleDelete = async id => {
        try {
            await axios({
                method: 'delete',
                url: `/api/posts/delete/${id}`
            })

            console.log('Entry successfully deleted.')
        } catch (err) {
            console.error(err)
        }
    }

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
                    <a href="javascript:void(0)" onClick={handlePlaceModal} style={{alignSelf: 'center', textDecoration: 'underline'}}>{ place.full_address || 'Choose Place'}</a>
                </div>
                <PlaceDialog
                    open={openPlaceDialog}
                    onClose={handleClosePlaceDialog}
                    handleClosePlaceDialog={handleClosePlaceDialog}
                    handleConfirmPlace={handleConfirmPlace}
                    place={place}
                    setPlace={setPlace} />
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{dialogAction.ACTION_TITLE}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            label="Title"
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
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle> Delete </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this post?
                        </Typography>
                    </DialogContent>                    
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={() => handleDelete()}> DELETE </Button>
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
                <Button startIcon={<Delete />} onClick={() => setOpenDeleteDialog(true)}> Delete </Button>
                <Button startIcon={<Save />} onClick={handleSaveModal}> Save </Button>
                <Button startIcon={<PublishOutlined />} onClick={handlePublishModal}> Publish </Button>
        </React.Fragment>
    )
}
