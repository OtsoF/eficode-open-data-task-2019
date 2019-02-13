import React from 'react';
import ReactDOM from 'react-dom';

const apiURL = process.env.APIURL || 'http://localhost:4000';

async function getSensorData() {
    try {
        const url = apiURL + '/sensors';
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error(error);
    }
    return { error: 'Failed to fetch from backend' };
}

const SensorDataRows = (props) => {
    const Rows = props.data.map(d => (
        <div>
            <li>Date: {d.date}</li>
            <li>Sensor 1: {d.sensor1}</li>
            <li>Sensor 2: {d.sensor2}</li>
            <li>Sensor 3: {d.sensor3}</li>
            <li>Sensor 4: {d.sensor4}</li>
        </div>
    ));
    return (
        <div>
            <ul>{Rows}</ul>
        </div>
    );
};

class App extends React.Component {
    state = { sensorData: [] }

    async componentWillMount() {
        const response = await getSensorData();
        this.setState({ sensorData: response });
    }

    render() {
        return (
            <div className='App'>
                <h1>Eficode Open Data Task 2019</h1>
                <SensorDataRows data={this.state.sensorData} />
            </div>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
