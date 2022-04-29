import getEnvVars from "../enviroment";

const { googleApiKey } = getEnvVars();

// This function fetches locations from the API that contain the given latitude and longitude
const fetchLocations = async (lat, long, JWT) => {
  const response = await fetch('https://2do4school.nl/api/locations?page=1&lat='+lat+'&longitude='+long, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/ld+json',
      'Authorization': JWT
    }
  })
  return await response.json();
}

// this function initialized the fetch fucntion
// and resolves a promise containing locations similar to the given latitude nad longitude
const getLocationsByCoords = (lat, long, JWT) => {
  // I shorten the decimal places of the values to make them less accurate (to take in account small deviations in GPS around the building)
  lat = Math.trunc(lat*100)/100;
  long = Math.trunc(long*100)/100;

  // convert lat and long to string to prevent parsing errors
  lat = lat.toString();
  long = long.toString();

  return new Promise(resolve => {
    fetchLocations(lat, long, JWT).then(data => {
      resolve(data["hydra:member"]);
    });
  })
}

// uses google maps api to fetch location details based on coordinates
const getLocationDescription = async (lat, long, JWT) => {
  const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key='+googleApiKey, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT
    }
  })
  return response.json();
}

// adds a new location to the database using the API
const postLocation = async (lat, long, JWT) => {
  // convert lat and long to string to prevent parsing errors
  lat = lat.toString();
  long = long.toString();

  // get description of location
  const description = await getLocationDescription(lat, long, JWT);

  const response = await fetch('https://2do4school.nl/api/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT
    },
    body: JSON.stringify({
      description: description.results[0].formatted_address,
      lat: lat,
      longitude: long
    })
  })
  return await response.json();
}

export {getLocationsByCoords, postLocation};