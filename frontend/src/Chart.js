import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';
import moment from 'moment'


function SensorChart(props) {
    if(props.data.hasOwnProperty('error')) {
        return <div>{ props.data.error }</div>
    }

    props.data.forEach(item => item.date = new Date(item.date).getTime());

    return (
        // 99% per https://github.com/recharts/recharts/issues/172
        <ResponsiveContainer width="99%" height={320}>
        <LineChart data = {props.data}>
            <XAxis 
                dataKey = 'date' 
                domain = {['auto', 'auto']}
                tickFormatter = {(date) => moment(date).format('HH:mm Do')}
                name = 'Date'
                type = 'number'
                scale = 'time'
            />
            <YAxis/>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={props.dataKey} stroke="#82ca9d" />
        </LineChart>
        </ResponsiveContainer>
    );
}

export default SensorChart;