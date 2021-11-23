import React, { useState, useEffect } from 'react';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia3Z0dW4iLCJhIjoiY2twcWQ1bHpsMGdocDJ2cXpxeWV4dmpwcSJ9.UEvqdwV4QQ_im2CGNQAGSQ';
const defaultCords = [35.17, 129.08]; 

export const Map = (props) => { // {places, setSelected}
    const [map, setMap] = useState({})
    const [initialCords, setInitialCords] = useState(defaultCords);
    // const [inView, setInView] = useState({})
    const [markers, setMarkers] = useState([])
    let mymap;

    //Accepts an array of objects representing different places, with each place having a coordinates property. 
    //This function uses these coordinates to generate a marker object and then adds those markers to the map 
    //provided as an argument
    const addMarkers = (mapObj, placesArray = []) => {
        placesArray.forEach((p) => {
            //The latitude and longitude in the places object in stored as a string in MongoDB
            //but the marker method takes an array of nums, I think. So, we parse.
            if (!p.hasOwnProperty('coordinates')) return;
            
            const coordinates = p.coordinates.map((latlong) => {
                return parseFloat(latlong)
            })

            const newMarker = L.marker(coordinates)
            newMarker.on('click', () => {
                console.log('Setting selected place to ', p)
                props.setSelected(p)})

            newMarker.addTo(mapObj)
            setMarkers([...markers, newMarker])
        })
    }

    const removeMarkers = (markerArray) => {
        markerArray.forEach((m) => {
            m.remove()
        })
    }


    useEffect(() => { // This effect initializes the leaflet map with a tile layer.        
        if (document.getElementById('map')) {
            mymap = L.map('map').setView(initialCords, 6)
                
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                minZoom: 2,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: MAPBOX_ACCESS_TOKEN
            }).addTo(mymap);    
            setMap(mymap)
        }
    }, [])

    useEffect(() => {
        if (document.getElementById('map') && Object.keys(map).length !== 0) {
            addMarkers(map, props.places)
        }
        
        return (function cleanUp() {
            removeMarkers(markers)
        })
    }, [props.places])

    return(
        <div id="map">
        </div>
    )
}