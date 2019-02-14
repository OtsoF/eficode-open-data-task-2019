const fetch = require('node-fetch');
const mongodb = require('mongodb');

const token = require('./conf/keys').APIToken;
const mongoConnectURI = require('./conf/keys').mongoURI;
const mongoCollection = process.env.NODE_ENV === 'prod' ? 'sensor-data' : 'sensor-data-dev';
const dbName = 'eficode-open-data-task-db';

async function sensorDataRequestLoop() {
    const intervalMinutes = 10;
    setInterval(async function() {
        console.log('Request loop starting');
        const newSensorData = await getSensorDataFromAPI();
        const sensorData = await getSensorDataFromMongo();
        if (newSensorData !== null && sensorData != null) {
            const collection = await sensorData.find({}).toArray();
            const newDate = new Date(newSensorData.date);
            if (!collection.some(item => item.date.getTime() === newDate.getTime())) {
                // newSensorData isn't in mongo yet, add
                console.log('Adding new sensor data to db');
                loadSensorDataToMongo({
                    date: newDate,
                    sensor1: newSensorData.sensor1,
                    sensor2: newSensorData.sensor2,
                    sensor3: newSensorData.sensor3,
                    sensor4: newSensorData.sensor4
                });
            }
        }
    }, 1000 * 60 * intervalMinutes);
};

async function getSensorDataFromAPI() {
    try {
        const url = 'https://opendata.hopefully.works/api/events';
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const res = await fetch(url, params);
        if(!res.ok) {
            throw new Error('HTTP error, status: ' + res.status);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getSensorDataFromMongo() {
    try {
        const client = await mongodb.MongoClient.connect(mongoConnectURI, { useNewUrlParser: true });
        return client.db(dbName).collection(mongoCollection);
    }catch (error) {
        console.error(error);
        return null;
    }
}

async function loadSensorDataToMongo(document) {
    try {
    const client = await mongodb.MongoClient.connect(mongoConnectURI, { useNewUrlParser: true });
    client.db(dbName).collection(mongoCollection).insertOne(document);
    } catch (error) {
        console.error(error);
    }
}

module.exports.sensorDataRequestLoop = sensorDataRequestLoop;
module.exports.getSensorDataFromMongo = getSensorDataFromMongo;