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

export const Browse = ({ routes, entries, setEntries }) => {
    let { countryCode } = useParams()
    let navigate = useNavigate()
    
    const handleClick = (entryId) => {
        navigate(`/posts/${entryId}`, {replace: false} )
    }

    return(
        <Container>
            <h2>{Object.keys(routes['Country'])}</h2>
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