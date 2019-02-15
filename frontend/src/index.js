import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './Chart';

const apiURL = process.env.APIURL || 'https://radiant-lowlands-34769.herokuapp.com';

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
                <h2>Sensor 1</h2>
                <Chart data={this.state.sensorData} dataKey='sensor1' />
                <h2>Sensor 2</h2>
                <Chart data={this.state.sensorData} dataKey='sensor2' />
                <h2>Sensor 3</h2>
                <Chart data={this.state.sensorData} dataKey='sensor3' />
                <h2>Sensor 4</h2>
                <Chart data={this.state.sensorData} dataKey='sensor4' />
            </div>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
