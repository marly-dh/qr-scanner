// this function stores a registration by posting to the API
const postRegistration = async (userID, date, locationID, JWT) => {
  const response = await fetch('https://2do4school.nl/api/registrations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT
    },
    body: JSON.stringify({
      user: '/api/users/'+userID,
      startTime: date,
      activity: '',
      location: '/api/locations/'+locationID
    })
  });
  return await response.json();
}

// this function fetches the registrations based on date and userID and then returns the result
const fetchRegistrations = async (date, userID, JWT) => {
  const response = await fetch('https://2do4school.nl/api/registrations?user='+userID+'&startTime='+date, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT
    }
  });
  return await response.json();
}

// this function initializes the fetch function and resolves a promise containing all the data
const getRegsByDate = (date, userID, JWT) => {
  return new Promise(resolve => {
    fetchRegistrations(date, userID, JWT).then(data => {
      resolve(data['hydra:member']);
    })
  });
}

// this function adds the checkOut field to the registration with the given id using a PATCH call to the API
const patchRegEndTime = async (id, date, JWT) => {
  const response = await fetch('https://2do4school.nl/api/registrations/'+id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Authorization': JWT
    },
    body: JSON.stringify({
      endTime: date
    })
  });
  return await response.json();
}

export {postRegistration, getRegsByDate, patchRegEndTime};