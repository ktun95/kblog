import React, { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Container,
         Grid,
         Stack,
         Card,
         CardActionArea,
         CardContent,
         CardMedia } from '@mui/material'

export const Browse = ({ routes }) => {
    let params = useParams()
    console.log(params)
    console.log('routes', routes)
    useEffect(() => {

    })
    
    // const fetchPosts = (uri) => {
    //     const posts = axios({
    //         method: 'get',
    //         url: '/'
    //     })
    // }

    return(
        <Container>
            <h2>{Object.keys(routes)}</h2>
            <Stack>
                <Card>
                    <CardActionArea>
                        <CardMedia />
                        <CardContent>
                            <p>Deserunt fugiat ut excepteur eu non Lorem consectetur Lorem ex anim occaecat tempor esse. Nisi occaecat qui cupidatat voluptate. Et excepteur exercitation anim proident et labore anim. Qui mollit reprehenderit ut nulla duis mollit. Pariatur sit velit laborum tempor deserunt.</p> 
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Stack>
        </Container>
    )

}