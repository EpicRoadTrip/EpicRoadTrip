const axios = require('axios');

async function getLocationsByCity(city) {
    return await axios.get(`https://epicroadtrip-qhxyjo7ukq-od.a.run.app/search/${city}`)
        .then((result) => {return result.data})
        .catch((err) => {throw err});
}

async function getStatus() {
    console.log('pinging');
    return await axios.get('https://epicroadtrip-qhxyjo7ukq-od.a.run.app/ping')
        .then((result) => {return result.data})
        .catch((err) => {throw err});
}

async function getLocationDetails(id) {
    return await axios.get(`https://epicroadtrip-qhxyjo7ukq-od.a.run.app/details/${id}`)
        .then((result) => {return result.data})
        .catch((err) => {throw err});
}

export {
    getLocationsByCity,
    getStatus,
    getLocationDetails
}

