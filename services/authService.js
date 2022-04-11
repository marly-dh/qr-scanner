const signIn = async (email, password) => {
  // this is a mock of an API call, in a real app
  // will be need connect with some real API,
  // send email and password, and if credential is corret
  //the API will resolve with some token and another datas as the below

  const response = await fetch('http://127.0.0.1:8000/remoteLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  return await response.json();
};

export const authService = {
  signIn,
};