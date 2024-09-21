/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chart from "../components/Chart"
import "../assets/tabs.css"
import { useEffect } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs(props) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [LSL, setLSL] = React.useState(0);
  const [USL, setUSL] = React.useState(100);
// const [loading, setLoading] = React.useState(true);

useEffect(() => {
  async function reqData() {
    try {
      const data = await fetch('http://localhost:3006/lastEntry');
      if (!data.ok) {
        alert("Cannot GET Readings");
      } else {
        const resp = await data.json();
        setLSL(parseInt(resp["results"][0]["LSL"]));
        setUSL(parseInt(resp["results"][0]["USL"]));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
    }
  }
  reqData();
}, []);

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleChangeIndex = (index) => {
  //   setValue(index);
  // };
  { console.log("LSL",LSL,"USL",USL) }
  return (
    <Box sx={() => ({
      bgcolor: 'background.paper', width: '100%',padding: "0px 0px 0px 0px",
    })} >
      <AppBar position="static">
        <Tabs sx={() => ({ bgcolor: "#212529", color: "white", borderBlockColor: "white", [`& .MuiTabs-indicator`]: { bgcolor: "#dc3545" } })}
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="black"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="ID Reading" {...a11yProps(0)} />
          <Tab label="OD Reading" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      {/* <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}

      > */}
      
      <TabPanel value={value} index={0} dir={theme.direction}>
        <Chart className="" Readings={props.id_readings} />
        <p className='text-center bg-dark text-light pb-3 mb-0' style={{width: "100%",height:"80%"}}>
        <span className={`badge text-dark ${(()=>{let current_readings = props.id_readings[props.id_readings.length-1];
         if(current_readings <= LSL) return "bg-warning";
         if(current_readings <= USL){ return "bg-success";}
         return "bg-danger"})()}`} style={{fontSize:"16px",fontWeight:"lighter",borderRadius:"30px"}}>
        CURRENT ID READING&nbsp;&nbsp;:&nbsp; {props.id_readings[props.id_readings.length-1]}
        </span>
        </p>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Chart className="" Readings={props.od_readings} />
        <p className='text-center bg-dark text-light pb-3 mb-0' style={{width: "100%",height:"80%"}}>
        <span className={`badge text-dark ${(()=>{let current_readings = props.od_readings[props.od_readings.length-1]; 
        if(current_readings <= LSL) return "bg-danger"; 
        else if(current_readings >= USL) return "bg-warning"; 
        else return "bg-success"})()}`} style={{fontSize:"16px",fontWeight:"lighter",borderRadius:"30px"}}>
        CURRENT OD READING&nbsp;&nbsp;:&nbsp; {props.od_readings[props.od_readings.length-1]}
        </span>
        </p>
      </TabPanel>
    {/* </SwipeableViews> */}
    </Box>
);
}