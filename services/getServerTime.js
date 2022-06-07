async function srvTime() {
  const response = await fetch('https://2do4school.nl/api');

  let date = new Date(response.headers.map.date);

  return new Promise(resolve => {
    resolve(date);
  })
}

export {srvTime};