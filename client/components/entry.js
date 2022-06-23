import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
// import ReactHtmlParser from 'react-html-parser'
import HtmlReactParser from 'html-react-parser'
import axios from 'axios'

// import htmlToDraft from 'html-to-draftjs'


async function fetchPostData(id) {
    const req = await axios({
        method: 'get',
        url: `/api/posts/${id}`
    })
    return req.data
}

export const Entry = ({ entries }) => {
    const { postId } = useParams()
    const [ jsx, setJsx ] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
        //If the user navigated from a browse page to a single entry, the data for the entry should already be in state. (In fact, the data from every post should
        //be loaded on initial render, but that could change in the future. Should that change occur, the previous statement would still hold) So we should attempt to 
        //retrieve the post data from state first.
        let selectedEntry

        (async function() {
            selectedEntry = entries.find((entry) => entry._id === postId) || await fetchPostData(postId)
            const html = draftToHtml(selectedEntry.postContents)
            setJsx(HtmlReactParser(html))
        })()
    }, [])

  
    return (
        <React.Fragment>
            {jsx ? jsx : null}
            <Button onClick={() => navigate(`/write/${postId}`)}> Edit </Button>
        </React.Fragment>
    )
}

