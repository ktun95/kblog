import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
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
    
    const displayPlacePredictions = async (string) => {
        
        if (!string || (string && string.length < 1)) return
        
        try {
            const service = new google.maps.places.AutocompleteService()
            await service.getPlacePredictions({input: string}, (predictionsObject)=> setPredictions(predictionsObject)) 
        } catch (err) {
            console.error(err.message, '\n', err.stack)
        }
    }

    const handleInputChange = e => {
        if (e) setSearchString(e.target.value)
    }

    const handleChange = (e, val) => {
        if (val) setSelected(val)
    }
    
    useEffect(() => {
        displayPlacePredictions(searchString)
    }, [searchString])

    return (
        <Dialog fullWidth   open={open} onClose={onClose}>
            <DialogTitle>Place</DialogTitle>
            <DialogContent>
                <Autocomplete
                    id="place-prediction"
                    label="Place"
                    freeSolo={true}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    options={predictions || []}
                    getOptionLabel={options => options.description || searchString}
                    renderInput={(params) => <TextField {...params} autoFocus fullWidth label="Place" variant="standard" />}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClosePlaceDialog}>Cancel</Button>
                <Button onClick={() => { handleConfirmPlace(selected) }}>OK</Button>
                {/* <Button onClick={() => handleSubmit(dialogAction.ACTION_TITLE === 'Publish' ? {publish: true} : {publish: false})}>{dialogAction.ACTION_TITLE}</Button> */}
            </DialogActions>    
        </Dialog>
    )
}


// async function fetchPostData(id) {
//     const req = await axios({
//         method: 'get',
//         url: `/api/posts/${id}`
//     })
//     return req.data
// }

export const WritePage = ({ entry = {}, entries, fetchAndSetEntries, initialDialogState = false }) => {
    const dialogActions = {
        'save': { ACTION_TITLE: 'Save', ACTION_ICON: Save },
        'publish': { ACTION_TITLE: 'Publish', ACTION_ICON: PublishOutlined }
    }
    
    const {postId} = useParams()
    let existingEntry = {};
    
    //Currently, refreshing on a page with a postId parameter will cause the app to crash due to the initial render having an uninitialized entries state. 
    //The editorState useState call attempts to call createWithContent on undefined, before the post data has a chance to be fetched. This will do for now.
    //update: Also, even if there are no params, a refresh or direct link to the /write route will attempt to call fetchPostData, except with an argument of 
    //undefined, resulting in a 500 error code. This is also fine for now.
    (async function() {
        existingEntry = entries.find((entry) => entry._id === postId) || {}
    })()
    
    const [ entryTitle, setEntryTitle ] = useState(existingEntry.title || '')
    const [ currentEntry, setCurrentEntry ] = useState(entry)
    const [ place, setPlace ] = useState(Object.keys(existingEntry).length ? existingEntry.place : {})
    const [ editorState, setEditorState ] = useState(Object.keys(existingEntry).length ? EditorState.createWithContent(convertFromRaw(existingEntry.postContents)) : EditorState.createEmpty() )
    const [ openPlaceDialog, setOpenPlaceDialog ] = useState(false)
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false)
    const [ openDialog, setOpenDialog ] = useState(initialDialogState)
    const [ dialogAction, setDialogAction ] = useState(dialogActions['save'])
    const navigate = useNavigate()

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

    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
    const handleChange = e => {
        setEntryTitle(e.target.value)
    }

    const handleSubmit = async ({ publish = false }) => {
        const newEntryForm = {
            title: entryTitle,
            place,
            postContents: convertToRaw(editorState.getCurrentContent()),
            publish
        }

        try {
            const req = (Object.keys(existingEntry).length ? 
            await axios({
                method: 'put',
                url: `/api/posts/${postId}`,
                data: newEntryForm
            }) :
            await axios({
                method: 'post',
                url: '/api/posts',
                data: newEntryForm
            }))

            fetchAndSetEntries()            

        } catch (err) {
            console.error(err)
        }
        
        handleCloseDialog()
    }

    const handleDelete = async id => {
        try {
            await axios({
                method: 'delete',
                url: `/api/posts/${id}`
            })
            setOpenDeleteDialog(false)
            fetchAndSetEntries()
            navigate('/posts/country/all')
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
                        <Button onClick={() => handleDelete(existingEntry._id || postId)}> DELETE </Button>
                    </DialogActions>    
                </Dialog>
                <Editor
                    editorState={editorState}
                    wrapperClassName='editor-wrapper'
                    editorClassName='editor' 
                    onEditorStateChange={handleEditorStateChange}
                />
                <Button startIcon={<Delete />} onClick={() => setOpenDeleteDialog(true)}> Delete </Button>
                <Button startIcon={<Save />} onClick={handleSaveModal}> Save As Draft </Button>
                <Button startIcon={<PublishOutlined />} onClick={handlePublishModal}> Publish </Button>
        </React.Fragment>
    )
}
