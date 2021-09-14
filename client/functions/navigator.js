// class Navigator {
//     constructor() {

//     }

    
// }

export const getUserLocation = () => {
    if (navigator.geolcation) {
        return navigator.geolocation.getCurrentPosition()
    } else {
        console.error('Geolocation is not supported by this browser')
    }
}

