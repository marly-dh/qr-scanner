const fetchLocations = async (lat, long) => {
  const response = await fetch('https://2do4school.nl/api/locations?lat='+lat+'&longitude='+long, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await response.json();
}

const getLocationsByCoords = (lat, long) => {
  lat = lat.toFixed(3);
  long = long.toFixed(3);

  return new Promise(resolve => {
    fetchLocations(lat, long).then(data => {
      resolve(data["hydra:member"]);
    });
  })
}

export {getLocationsByCoords};