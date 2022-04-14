import React, { useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Container,
         Grid,
         Stack,
         Card,
         CardActionArea,
         CardContent,
         CardHeader,
         CardMedia } from '@mui/material'

export const Browse = ({ routes, entries }) => {
    let params = useParams()
    let navigate = useNavigate()
    
    const handleClick = (entryId) => {
        navigate(`${entryId}`, {replace: false} )
    }
    // const fetchPosts = (uri) => {
    //     const posts = axios({
    //         method: 'get',
    //         url: '/'
    //     })
    // }

    return(
        <Container>
            <h2>{Object.keys(routes)}</h2>
            <Stack spacing={1}>
                {entries.map((entry, idx) => {
                    return (
                        <Card key={idx}> 
                            <CardActionArea onClick={() => handleClick(entry._id)}>
                                <CardHeader title={entry.title} />
                                {/* <CardMedia /> */}
                                <CardContent>
                                    <p>Deserunt fugiat ut excepteur eu non Lorem consectetur Lorem ex anim occaecat tempor esse. Nisi occaecat qui cupidatat voluptate. Et excepteur exercitation anim proident et labore anim. Qui mollit reprehenderit ut nulla duis mollit. Pariatur sit velit laborum tempor deserunt.</p> 
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </Stack>
        </Container>
    )

}