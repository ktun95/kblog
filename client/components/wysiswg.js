import React, { useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const WritePage = props => {


    return(
        <React.fragment>
            <Editor
                // editorState={editorState}
                // toolbarClassName="toolbarClassName"
                // wrapperClassName="wrapperClassName"
                // editorClassName="editorClassName"
                // onEditorStateChange={this.onEditorStateChange}
            />;
        </React.fragment>
    )
}
