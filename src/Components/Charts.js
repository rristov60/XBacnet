import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import InfoAlert from './InfoAlert';

const d = new Date();

const convertTimeStampToReadable = (timestamp) => {
  var date = new Date(timestamp);
  return `${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}:${(date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()}`;
}
 
const Charts = ({ subscriptionToPlot, subscriptions, activeSubscriptions }) => {

    var rows = [];
    var data = [];
    var valueI = 0;

    const createRows = () => {
      const theSubscription = activeSubscriptions.filter(x => x.device == subscriptionToPlot.device && x.type == subscriptionToPlot.objectType && x.instance == subscriptionToPlot.instance);

      if(theSubscription.length != 0) {
        var currentSubscription = subscriptions.filter(x => x.device == theSubscription[0].device && x.type == theSubscription[0].type && x.instance == theSubscription[0].instance);
       
        if(currentSubscription.length != 0 && currentSubscription[0].values != undefined) {
            currentSubscription[0].values.forEach((value) => {
              var objToPush = {};
              objToPush['time'] = convertTimeStampToReadable(value.time);
              objToPush[theSubscription[0].name] = value.data.value;
  
              rows.push(objToPush);
            })
          }
      }
    }

    createRows();

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
                <LineChart margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid stroke="transparent" strokeDasharray="5 5" />
                    <XAxis dataKey="time" stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                    <YAxis stroke='white' tick={{ fontSize: '0.8rem', fontFamily: 'League Spartan' }}/>
                    {
                      <>
                        <Line data={rows} type="monotone" dataKey={subscriptionToPlot.OBJECT_NAME} stroke="#A3E635"/>
                      </>
                    }
                    <Tooltip contentStyle={{ backgroundColor: '#0A122A', border: 'unset', color: 'white' }}/>
                </LineChart>
            </ResponsiveContainer>

          }
        </>
      )
}

export default Charts