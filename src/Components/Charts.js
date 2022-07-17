import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import InfoAlert from './InfoAlert';

const d = new Date();

const Charts = ({ variable }) => {

    const data = [
        {name: d.getMinutes(), uv: 400, pv: 2400, amt: 2400}, 
        {name: d.getSeconds(), uv: 200, pv: 2433, amt: 122234},
        {name: d.getHours(), uv: 230, pv: 123, amt: 22}, 
        {name: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} h:m:s`, uv: 854, pv: 123, amt: 222}, 
        {name: 'Page C', uv: 1233, pv: 123, amt: 111}, 
      ];

      return (
        <>
          {
            (variable?.cov == undefined) 
            ?
            <div style={{ width: '100%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '50%'}}>
                <InfoAlert text='Nothing to plot !' />
              </div>
            </div>
            :
            <ResponsiveContainer width="95%" height='93%'>
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <Line type="monotone" dataKey="uv" stroke="#A3E635"/>
                    <CartesianGrid stroke="transparent" strokeDasharray="5 5" />
                    <XAxis dataKey="name" stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                    <YAxis stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                    <Tooltip contentStyle={{ backgroundColor: '#0A122A', border: 'unset', color: 'white' }}/>
                </LineChart>
            </ResponsiveContainer>

          }
        </>
      )
}

export default Charts