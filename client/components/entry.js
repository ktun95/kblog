import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import htmlToDraft from 'html-to-draftjs'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'

// import htmlToDraft from 'html-to-draftjs'



export const Entry = ({ entry }) => {
    const { postId } = useParams()
    const [ jsx, setJsx ] = useState([])

    useEffect(() => {
        console.log('fetching post data')
        async function fetchPostData() {
            const req = await axios({
                method: 'get',
                url: `/api/posts/${postId}`
            })
            const html = req.data.postContents
            setJsx(ReactHtmlParser(html))
        }
        fetchPostData()
    }, [])

  
    return (
        <React.Fragment>
            {console.log(jsx)}
            {jsx ? jsx : null}
        </React.Fragment>
    )
}

