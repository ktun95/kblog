import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,
         Switch,
         Route,
         useHistory } from 'react-router-dom';
import axios from 'axios'
import { Map,
         ContentContainer,
         ExampleEntry,
         Entry,
         Header,
         Write,
         Browse } from '.';
import { Container,
         SwipeableDrawer,
         AppBar,
         Drawer,
         Toolbar,
         Button,
         ListItem,
         ListItemText,
         Accordion,
         AccordionSummary,
         AccordionDetails } from '@mui/material';

export const Main = () => {
    const [showMap, setShowMap] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selected, setSelected] = useState({})
    const [isWriteMode, setIsWriteMode] = useState(false)
    const [places, setPlaces] = useState([])
    const history = useHistory()

    const handleNav = (path) => {
        history.push(path)
    }

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
                <ListItem button key="Map">
                    <ListItemText>Map</ListItemText>
                </ListItem>
                <Accordion square={true} /*disableGutters={true}*/ style={{ boxShadow: "none", border: "none"}}>
                    <AccordionSummary>
                        By Country
                    </AccordionSummary>
                    <AccordionDetails >
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <ListItem button key="All">
                                <ListItemText>All</ListItemText>
                            </ListItem>
                            <ListItem button key="Korea">
                                <ListItemText>Korea</ListItemText>
                            </ListItem>
                            <ListItem button key="USA">
                                <ListItemText>USA</ListItemText>
                            </ListItem>
                            <ListItem button key="China">
                                <ListItemText>China</ListItemText>
                            </ListItem>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Drawer>
            <Container sx={{
                padding: "1rem",
                overflowY: "auto",
                height: "100%",
                maxWidth: "100%"
            }}>
                <Router>
                    <Route path="/map">
                            <Map places={places} showMap={showMap} setSelected={setSelected}/>
                    </Route>
                    <Route path="/country/sk">
                        <Browse /> 
                    </Route>
                    <Route path="/country/sk/test">
                        {places.length ? <Entry selected={places[0]} /> : null}
                    </Route>
                </Router>
            </Container>
        </React.Fragment>
    )
};



