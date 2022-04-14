// This function fetches locations from the API that contain the given latitude and longitude
const fetchLocations = async (lat, long) => {
  const response = await fetch('https://2do4school.nl/api/locations?lat='+lat+'&longitude='+long, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await response.json();
}

// this function initialized the fetch fucntion
// and resolves a promise containing locations similar to the given latitude nad longitude
const getLocationsByCoords = (lat, long) => {
  // I shorten the decimal places of the values to make them less accurate (to take in account small deviations in GPS around the building)
  lat = lat.toFixed(2);
  long = long.toFixed(2);

  return new Promise(resolve => {
    fetchLocations(lat, long).then(data => {
      resolve(data["hydra:member"]);
    });
  })
}

export {getLocationsByCoords};