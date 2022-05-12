import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export const GoogleMap = ({ places, setSelected }) => {
    let googleMap;
    const [map, setMap] = useState({})
    const navigate = useNavigate()

    const addMarkers = (mapObj, placesArray = []) => {
        placesArray.forEach((p) => {
            //The latitude and longitude in the places object is stored as a string in MongoDB
            //but the marker method takes an array of nums, I think. So, we parse.
            if (!p.hasOwnProperty('coordinates') || !p.coordinates ) return;
            
            const coordinates = p.coordinates.map((latlong) => {
                return parseFloat(latlong)
            })

            const newMarker = new google.maps.Marker({
                position: {
                    lat: coordinates[0], lng: coordinates[1],
                },
                map: mapObj
            })

            newMarker.addListener('click', () => {
                console.log('Setting selected place to ', p)
                setSelected(p)
                navigate(`/posts/${p._id}`)
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
    }, [places])
    
    useEffect(() => {
        console.log('adding markers ', places)
        addMarkers(googleMap, places)
        
    }, [googleMap, places])

    return (
        <div id="map"></div>
    )
}
