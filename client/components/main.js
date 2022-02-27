import React, { useState, useEffect } from 'react';
import { Routes,
         Route,
        useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Map,
         ContentContainer,
         ExampleEntry,
         Entry,
         Header,
         Write,
         Browse,
         CollapsingMenuList } from '.';
import { Container,
         SwipeableDrawer,
         AppBar,
         Drawer,
         Toolbar,
         Button,
         Collapse,
         List,
         ListItem,
         ListItemButton,
         ListItemText,
         Accordion,
         AccordionSummary,
         AccordionDetails } from '@mui/material';

const routes = {
    "Map": '/map',
    "Country": {
        "All": 'country/all',
        "South Korea": 'country/korea',
        "USA": 'country/usa',
        "China": 'country/china',
    }
}

export const Main = () => {
    const [showMap, setShowMap] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selected, setSelected] = useState({})
    const [isWriteMode, setIsWriteMode] = useState(false)
    const [places, setPlaces] = useState([])
    let navigate = useNavigate()
    
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
    
    const handleScroll = (e) => {

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
            {/* <Header selected={selected} setSelected={setSelected} isWriteMode={isWriteMode} setIsWriteMode={setIsWriteMode} toggleWriteMode={toggleWriteMode} /> */}
            {/* <Accordion expanded={showMap}>
                <AccordionSummary expandIcon={<span>V</span>} onClick={() => {setShowMap(!showMap)}}>
                    MAP
                </AccordionSummary>
                <AccordionDetails>
                    <Map places={places} showMap={showMap} setSelected={setSelected}/>
                </AccordionDetails>
            </Accordion> */}
            <AppBar position="relative">
                <Toolbar>
                    <Button variant="text" color="inherit" onClick={() => toggleDrawer(!isDrawerOpen)}> = </Button>
                    <h1>Kady's Travels</h1>
                </Toolbar>
            </AppBar> 
            <Drawer anchor="left" open={isDrawerOpen} variant="persistent">
                <Toolbar>
                    <Button variant="text" color="inherit" onClick={() => toggleDrawer(!isDrawerOpen)}> = </Button>
                </Toolbar>
                <ListItemButton key="Map" onClick={() => navigate('/map')}>
                    <ListItemText primary="Map" key="Map" />
                </ListItemButton>
                <CollapsingMenuList routes={routes["Country"]} />
            </Drawer>
            <Container sx={{
                padding: "1rem",
                overflowY: "auto",
                height: "100%",
                maxWidth: "100%"
            }}>
                <Routes>
                    <Route path="/map" element={<Map places={places} showMap={showMap} setSelected={setSelected}/>} />                            
                    {/* <Route path="/country/sk" element={<Browse />} />                          */}
                    {/* <Route path="/country/sk/test">
                        {places.length ? <Entry selected={places[0]} /> : null}
                    </Route> */}
                </Routes>
            </Container>
        </React.Fragment>
    )
};



