import React, { useState, useEffect } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { Button,
         TextField,
         Dialog,
         DialogActions,
         DialogContent,
         DialogTitle } from '@mui/material'
import { PublishOutlined, Save, Delete } from '@mui/icons-material'
import axios from 'axios'
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// const DraftModal = ({ action, dialogState, setDialogState }) => {

//     const handleClose = () => {
        
//     }

//     return (
//         <Dialog open={dialogState} onClose={handleClose}>
            
//         </Dialog>
//     )
// }



export const WritePage = ({ entry = {}, initialDialogState = false }) => {
    
    const dialogActions = {
        'save': { ACTION_TITLE: 'Save', ACTION_ICON: Save },
        'publish': { ACTION_TITLE: 'Publish', ACTION_ICON: PublishOutlined }
    }
    
    const [ entryTitle, setEntryTitle ] = useState(entry.title || '')
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
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

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }
    
    const handleChange = e => {
        console.log(entryTitle)
        setEntryTitle(e.target.value)
    }

    //modify this function to account for whether the post is being saved as a draft or published
    const handleSubmit = async ({ publish = false }) => {
        const newEntry = {
            title: entryTitle,
            postContents: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            publish
        }
        
        console.log(newEntry)
        const req = await axios({
            method: 'post',
            url: '/api/posts',
            data: newEntry
        })

        console.log(req)
    }

    // useEffect(() => {
    //     console.dir(convertToRaw(editorState.getCurrentContent()))
    //     console.dir(editorState.getCurrentContent())
    // })

    return(
        <React.Fragment>
                <input 
                    id="entry-title"
                    value={entryTitle}
                    onChange={handleChange}
                    placeholder="Untitled"
                    >
                    
                    
                </input>
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
