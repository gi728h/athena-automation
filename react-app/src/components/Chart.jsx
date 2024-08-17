import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function BasicArea(props) {

  return (
    <div style={{ width: '100%', height: '54vh', maxWidth: '100%' }}>
      <LineChart
        className="text-center"
        series={[
          {
            // eslint-disable-next-line react/prop-types
            data: props.Readings,
            curve: 'linear',
            color: '#dc3545',
            backgroundColor: 'red',
          },
        ]}
        grid={{ stroke: 'white' }} // Grid lines color
      // Set width to 100% to make it responsive
// You can adjust the height as needed
        sx={() => ({
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: '#FFFFFF',
              strokeWidth: 3,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: '#FFFFFF',
            },
          },
          backgroundColor: '#212529',
          ['& .MuiMarkElement-root']: {
            fill: '#212529',
          },
        })}
      />
    </div>
  );
}
