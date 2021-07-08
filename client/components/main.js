import React, { useState, useEffect } from 'react'; 
import axios from 'axios'
import { Map, ContentContainer, ExampleEntry, Entry, Header } from '.';
import { SwipeableDrawer, 
         Accordion,
         AccordionSummary,
         AccordionDetails } from '@material-ui/core';

export const Main = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [places, setPlaces] = useState([])
    const [selected, setSelected] = useState({})
    const [showMap, setShowMap] = useState(true)
    
    const toggleMap = (bool) => {
        setShowMap(bool)
    }
    const toggleDrawer = (bool) => {
        setIsDrawerOpen(bool)
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
            {/* <div onClick={() => toggleDrawer(true)}>open drawer</div> */}
            <Header />
            <Accordion>
                <AccordionSummary expandIcon={<span>V</span>}>
                    MAP
                </AccordionSummary>
                <AccordionDetails>
                    <Map places={places} showMap={showMap} setSelected={setSelected}/>
                </AccordionDetails>
            </Accordion>
            {/* <Map places={places} showMap={showMap} /> */}
            <ContentContainer>
                {Object.keys(selected).length ? <Entry selected={selected}/> : <ExampleEntry />}
            </ContentContainer>
            <SwipeableDrawer open={isDrawerOpen}>
                <div onClick={() => toggleDrawer(false)}>
                </div>
            </SwipeableDrawer>
        </React.Fragment>
    )
};



