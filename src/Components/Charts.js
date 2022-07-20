import { create } from '@mui/material/styles/createTransitions';
import { rowsMetaStateInitializer } from '@mui/x-data-grid/internals';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import InfoAlert from './InfoAlert';

const d = new Date();

const convertTimeStampToReadable = (timestamp) => {
  var date = new Date(timestamp);
  return `${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}:${(date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()}`;
}

const Charts = ({ variable, subscriptions, activeSubscriptions }) => {

    console.log('Chart.js subscriptions: ', subscriptions);
    var rows = [];
    var data;

    const createRows = () => {
      activeSubscriptions.forEach((subscription) => {
        var currentSubscription = subscriptions.filter(x => x.device == subscription.device && x.type == subscription.type && x.instance == subscription.instance);
        if(currentSubscription.length != 0 && currentSubscription[0].values != undefined) {
          currentSubscription[0].values.forEach((value) => {
            rows.push({
              name: convertTimeStampToReadable(value.time),
              value: value.data.value
            })
          })
            // rows.push({
            //   name: convertTimeStampToReadable(currentSubscription[0].values[currentSubscription[0].values.length - 1].time),
            //   value: currentSubscription[0].values[currentSubscription[0].values.length - 1].data.value,
            //   // pv: 2400, amt: 2400
            // });

            // rows.push({
            //   name: convertTimeStampToReadable(currentSubscription[0].values[currentSubscription[0].values.length - 2].time),
            //   value: currentSubscription[0].values[currentSubscription[0].values.length - 2].data.value,
            //   // pv: 2400, amt: 2400
            // });



            data = [...rows];
            // rows.push(createData(currentSubscription[0].device, 
            //                       currentSubscription[0].type, 
            //                       currentSubscription[0].instance, 
            //                       currentSubscription[0].values[currentSubscription[0].values.length - 1].data.value, 
            //                       // currentSubscription[0].values[currentSubscription[0].values.length - 1].time, 
            //                       convertTimeStampToReadable(currentSubscription[0].values[currentSubscription[0].values.length - 1].time), 
            //                       currentSubscription[0].values));
        }
      });
    }
    createRows();
    // const data = [
    //     {name: d.getMinutes(), uv: 400, pv: 2400, amt: 2400}, 
    //     {name: d.getSeconds(), uv: 200, pv: 2433, amt: 122234},
    //     {name: d.getHours(), uv: 230, pv: 123, amt: 22}, 
    //     {name: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} h:m:s`, uv: 854, pv: 123, amt: 222}, 
    //     {name: 'Page C', uv: 1233, pv: 123, amt: 111}, 
    //   ];

      return (
        <>
          {
            (activeSubscriptions.length == 0) 
            ?
            <div style={{ width: '100%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '50%'}}>
                <InfoAlert text='Nothing to plot !' />
              </div>
            </div>
            :
            <ResponsiveContainer width="95%" height='93%'>
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <Line type="monotone" dataKey="value" stroke="#A3E635"/>
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