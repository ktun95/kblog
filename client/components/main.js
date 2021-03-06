import React, { useState, useEffect } from 'react';
import { Routes,
         Route,
         useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Map,
         GoogleMap,
         ContentContainer,
         WritePage,
         ExampleEntry,
         Entry,
         Header,
         Write,
         Browse,
         CollapsingMenuList,
         MyAppBar,
         MyDrawer,
         Login } from '.';
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
        "All": 'posts/country/all',
        // "South Korea": 'posts/country/korea',
        // "USA": 'posts/country/usa',
        // "China": 'posts/country/china',
    }
}


export const Main = () => {
    const drawerWidth = "10rem"
    // const [showMap, setShowMap] = useState(true)
    const [map, setMap] = useState({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selected, setSelected] = useState({})
    const [isWriteMode, setIsWriteMode] = useState(false)
    const [entries, setEntries] = useState([])
    let navigate = useNavigate()

    const toggleMap = (bool) => {
        setShowMap(bool)
    }

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen)
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleWriteMode = () => {
        setIsWriteMode(!isWriteMode)
    }
    
    const handleScroll = (e) => {

    }

    const fetchAndSetEntries = async () => {
        try {
            const req = await axios({
                method: 'get',
                url: '/api/posts/all'
            })
            const newEntries = req.data
            setEntries(newEntries)
            return newEntries
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAndSetEntries()
    }, [setEntries])

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
            <MyAppBar toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth}/>
            <MyDrawer toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth} routes={routes} />
            <Container sx={{
                padding: "1rem",
                height: "100%",
                maxWidth: "100%"
            }}>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path="/write">
                        <Route path=":postId" element={<WritePage entries={entries} fetchAndSetEntries={fetchAndSetEntries}/>} />
                        <Route path="" element={<WritePage entries={entries} fetchAndSetEntries={fetchAndSetEntries}  />} />
                    </Route>
                    <Route path="/map" element={<GoogleMap entries={entries.filter(entry => !!entry.publishDate)} setSelected={setSelected} />} />                            
                    <Route path="/posts/drafts/" element={<Browse routes={routes} setEntries={setEntries} entries={entries.filter(entry => !entry.publishDate || entry.publishDate == null)} />} />
                    <Route path="/posts/drafts/:postId" element={<Entry />} />
                    <Route path="/posts/:postId" element={<Entry entries={entries} />} />                         
                    <Route path="/posts/country/:countryCode" element={<Browse routes={routes} entries={entries.filter(entry => !!entry.publishDate)} />} />                         
                    <Route index element={<GoogleMap entries={entries} setSelected={setSelected} />} />                            
                    {/* <Route path="/posts/country/:countryCode/:id" element={<EntryWrite />} />                          */}
                    {/* <Route path="/country/sk/test">
                        {entries.length ? <Entry selected={entries[0]} /> : null}
                    </Route> */}
                </Routes>
            </Container>
        </React.Fragment>
    )
};