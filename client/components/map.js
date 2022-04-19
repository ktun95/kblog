import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia3Z0dW4iLCJhIjoiY2twcWQ1bHpsMGdocDJ2cXpxeWV4dmpwcSJ9.UEvqdwV4QQ_im2CGNQAGSQ';
const defaultCords = [35.17, 129.08]; //should be set 

export const Map = (props) => { // {places, setSelected}
    const [map, setMap] = useState({})
    const [initialCords, setInitialCords] = useState(defaultCords);
    // const [inView, setInView] = useState({})
    const [markers, setMarkers] = useState([])
    const navigate = useNavigate()

    let mymap;
    let myRepeatingMarkers = L.gridLayer.repeatedMarkers()
    
    //Accepts an array of objects representing different places, with each place having a coordinates property. 
    //This function uses these coordinates to generate a marker object and then adds those markers to the map 
    //provided as an argument
    const addMarkers = (mapObj, placesArray = []) => {
        placesArray.forEach((p) => {
            //The latitude and longitude in the places object is stored as a string in MongoDB
            //but the marker method takes an array of nums, I think. So, we parse.

            if (!p.hasOwnProperty('coordinates') || !p.coordinates ) return;
            
            const coordinates = p.coordinates.map((latlong) => {
                return parseFloat(latlong)
            })

            const newMarker = L.marker(coordinates)
            newMarker.on('click', () => {
                // console.log('Setting selected place to ', p)
                // props.setSelected(p)
                navigate(`/posts/${p._id}`)
            })

            myRepeatingMarkers.addMarker(newMarker)
            // newMarker.addTo(mapObj)
            setMarkers([...markers, newMarker])
        })
    }

    const removeMarkers = (markerArray) => {
        markerArray.forEach((m) => {
            myRepeatingMarkers.removeMarker(m)
            m.remove()
        })
    }


    useEffect(() => { // This effect initializes the leaflet map with a tile layer.        
        if (document.getElementById('map')) {
            mymap = L.map('map', {
                maxZoom: 18,
                minZoom: 3,
                maxBounds: [
                    [-90, -180],
                    [90, 180]
                ]
            }).setView(initialCords, 6) 
                
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                // maxZoom: 18,
                // minZoom: 17,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                worldCopyJump: true,
                // noWrap: true,
                // bounds: [
                //     [-90, -180],
                //     [90, 180]
                // ],
                accessToken: MAPBOX_ACCESS_TOKEN
            }).addTo(mymap);    

            //enables repeating markers when wrapping around globe
            myRepeatingMarkers.addTo(mymap)
            setMap(mymap)
        }
    }, [])

    useEffect(() => {
        //Check if a container div with id 'map' is present and if there is a react state object, 'map'
        if (document.getElementById('map') && Object.keys(map).length !== 0) {
            addMarkers(map, props.places)
            myRepeatingMarkers.addTo(map)   
        }
        
        return (function cleanUp() {
            removeMarkers(markers)
        })
    }, [props.places, map])

    return(
        <div id="map"></div>
    )
}