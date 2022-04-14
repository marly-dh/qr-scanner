const signIn = async (email, password) => {

  // make POST request with the given email and password
  const response = await fetch('https://2do4school.nl/remoteLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  // resolve the promise with the response data (with correct input from the user it will return user data otherwise an error with what went wrong)
  return new Promise(resolve => {
    resolve(response.json())
  });
};

export const authService = {
  signIn,
};