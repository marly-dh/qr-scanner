async function srvTime() {
  const response = await fetch('https://2do4school.nl/api');

  return new Promise(resolve => {
    resolve(response.headers.map.date);
  })
}

export {srvTime};