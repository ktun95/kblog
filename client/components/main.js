import React, { useState, useEffect } from 'react'; 
import axios from 'axios'
import { Map,
         ContentContainer,
         ExampleEntry,
         Entry,
         Header,
         Write } from '.';
import { SwipeableDrawer, 
         Accordion,
         AccordionSummary,
         AccordionDetails } from '@material-ui/core';

export const Main = () => {
    const [showMap, setShowMap] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selected, setSelected] = useState({})
    const [isWriteMode, setIsWriteMode] = useState(false)
    const [places, setPlaces] = useState([])

    const toggleMap = (bool) => {
        setShowMap(bool)
    }

    const toggleDrawer = (bool) => {
        setIsDrawerOpen(bool)
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleWriteMode = () => {
        setIsWriteMode(!isWriteMode)
    }    

    useEffect(() => {
        async function getPosts() {
            const posts = await axios({
                method: 'get',
                url: '/api/posts/all'
            })
            setPlaces(posts.data) 
        }
        getPosts()
    }, [])

    useEffect(() => {
        window.addEventListener("load", function() {
            setTimeout(function() {
              var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
              if (scrollPos < 1) {
                window.scrollTo(0,1);
              }
            }, 0);
          });
    }, [])

    return(
        <React.Fragment>
            <Header selected={selected} setSelected={setSelected} isWriteMode={isWriteMode} setIsWriteMode={setIsWriteMode} toggleWriteMode={toggleWriteMode} />
            <Accordion expanded={showMap}>
                <AccordionSummary expandIcon={<span>V</span>} onClick={() => {setShowMap(!showMap)}}>
                    MAP
                </AccordionSummary>
                <AccordionDetails>
                    <Map places={places} showMap={showMap} setSelected={setSelected}/>
                </AccordionDetails>
            </Accordion>
            <ContentContainer setShowMap={setShowMap}>
                {Object.keys(selected).length ? <Entry selected={selected} isWriteMode={isWriteMode} setIsWriteMode={setIsWriteMode} /> : <ExampleEntry />}
            </ContentContainer>
        </React.Fragment>
    )
};



