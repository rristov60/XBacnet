import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';

const Charts = () => {
    const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 200, pv: 2433, amt: 1234}, {name: 'Page C', uv: 2010, pv: 243123, amt: 1234}];
      return (
        <ResponsiveContainer width="95%" height='93%'>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <Line type="monotone" dataKey="uv" stroke="#A3E635"/>
                <CartesianGrid stroke="transparent" strokeDasharray="5 5" />
                <XAxis dataKey="name" stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                <YAxis stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                <Tooltip contentStyle={{ backgroundColor: '#0A122A', border: 'unset', color: 'white' }}/>
            </LineChart>
        </ResponsiveContainer>
      )
}

export default Charts