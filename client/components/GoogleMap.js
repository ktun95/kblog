import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export const GoogleMap = ({ entries, setSelected }) => {
    let googleMap;
    const [map, setMap] = useState({})
    const navigate = useNavigate()

    const addMarkers = (mapObj, entriesArray = []) => {
        entriesArray.forEach((entry) => {
            //The latitude and longitude in the entries object is stored as a string in MongoDB
            //but the marker method takes an array of nums, I think. So, we parse.
            if (!entry.hasOwnProperty('place') || !entry.place || !entry.place.coordinates ) return;
            const newMarker = new google.maps.Marker({
                position: {
                    lat: entry.place.coordinates.lat, lng: entry.place.coordinates.lng,
                },
                map: mapObj
            })

            newMarker.addListener('click', () => {
                console.log('Setting selected place to ', entry)
                setSelected(entry)
                navigate(`/posts/${entry._id}`)
            })

            // myRepeatingMarkers.addMarker(newMarker)
            // // newMarker.addTo(mapObj)
            // setMarkers([...markers, newMarker])
        })
    }

    useEffect(() => {
        let mapElement = document.getElementById("map")
        
        if (mapElement) {
            googleMap = new google.maps.Map(document.getElementById("map"), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                restriction: {
                    latLngBounds: {north: 85, south: -85, west: -180, east: 180},
                    strictBounds: true
                }
            })

            setMap(googleMap)
        }
    }, [entries])
    
    useEffect(() => {
        console.log('adding markers ', entries)
        addMarkers(googleMap, entries)
        
    }, [googleMap, entries])

    return (
        <div id="map"></div>
    )
}
