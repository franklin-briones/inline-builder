console.log('Fetching...')
fetch('http://localhost:8000/get-settings', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(response => {
        console.log(response)
        sessionStorage.setItem('mySettingsId', response._id);
        console.log('String stored in session storage:', response._id);
    })
    .catch(error => {
        console.log(error)
    })