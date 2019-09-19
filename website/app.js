let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const countryCode = ",in";
const apiKey = "************";
const apiUnits = "&units=imperial";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";

document.getElementById('generate').addEventListener('click', validation);


window.onload = function() {
    getData("/getRecentData").then(function(finalData) {
        if (finalData.temperature) {
            document.getElementById('date').innerHTML = finalData.date;
            document.getElementById('temp').innerHTML = finalData.temperature;
            document.getElementById('content').innerHTML = finalData.userResponse;
        }
    })
};


function performAction() {
    const zipCode = document.getElementById('zip').value;
    const feeling = document.getElementById('feelings').value;
    getWeather(baseURL, zipCode, apiKey)
        .then(function(data) {
            const apiData = {
                temperature: data.main.temp,
                date: newDate,
                userResponse: feeling
            };
            postData("/saveData", apiData);
        })
        .then(function() {
            getData("/getRecentData").then(function(finalData) {
                if (finalData.temperature) {
                    document.getElementById('temp').innerHTML = finalData.temperature;
                    document.getElementById('date').innerHTML = finalData.date;
                    document.getElementById('content').innerHTML = finalData.userResponse;
                }
            })
        });
}

const getWeather = async (baseURL, zipCode, apiKey) => {
    const res = await fetch(`${baseURL}${zipCode}${countryCode}${apiKey}${apiUnits}`);

    try {
        if (res.status === 404) {
            alert("No City with this Zip Code");
            return {
                main: {
                    temp: ""
                }
            }
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Error in Weather Fetching", error);
    }
}

const postData = async (url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("Error in PostData", error);
    }
}

const getData = async (url = '') => {

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("Error in GetData", error);
    }
}


function validation() {
    const zip = document.getElementById('zip').value;
    if (!(zip > 99999 && zip < 1000000)) {
        alert("Zip should be of 6 Digits");
    } else {
        performAction();
    }
}