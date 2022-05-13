const signIn = async (email, password) => {

  // make POST request with the given email and password
  const response = await fetch('https://2do4school.nl/authentication_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  // resolve the promise with the response data (with correct input from the user it will return a JWT otherwise an error with what went wrong)
  return new Promise(resolve => {
    resolve(response.json())
  });
};

// this function fetches the user with the given email from the database
const fetchUsers = async (email, JWT) => {
  const response = await fetch('https://2do4school.nl/api/users?page=1&email='+encodeURIComponent(email), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT
    }
  });

  return await response.json();
}

// this function initializes the fetch function and resolves a promise containing all the data
const getUserData = (email, JWT) => {
  return new Promise(resolve => {
    fetchUsers(email, JWT).then(data => {
      resolve(data['hydra:member'])
    })
  });
}

export const authService = {
  signIn,
  getUserData
};

