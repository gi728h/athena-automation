/* eslint-disable no-constant-condition */
import { useEffect, useState } from 'react';
import '../assets/pop.css';
import FullWidthTabs from '../components/Tabs';

export default function Home() {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popMessage, setPopMessage] = useState({
        title: "",
        message: ""
    });
    const [Progress, setProgress] = useState(0);
    const [ID_Readings, setID_Readings] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [OD_Readings, setOD_Readings] = useState([]);
    const [Success, setSuccess] = useState(false);

    


    useEffect(() => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function popUp() {
            var result = await fetch('http://localhost:3006/test');
            if (!result.ok) {
                setPopMessage({
                    title: "Error",
                    message: "Failed to connect to database"
                })
                setPopupVisible(true);
            } else {
                setPopMessage({
                    title: "Zero Callibration",
                    message: "Put Zero Callibrtion Master in Gauge"
                })
                setProgress(25);
                setPopupVisible(true);
                while (true) {
                     result = await fetch('http://localhost:3006/Fields?field_name="Zero"');
                    if (!result.ok) {
                        setPopMessage({
                            title: "Error",
                            message: "Internal Server Error"
                        })
                    }else{
                        data = await result.json();
                        if(data[0].value == "True"){
                            setPopMessage({
                                title: "High Callibration",
                                message: "Put High Callibrtion Master in Gauge"
                            })
                            setProgress(50);
                            break;
                        }
                    }
                }

                while (true) {
                    result = await fetch('http://localhost:3006/Fields?field_name="High"');
                    if (!result.ok) {
                        setPopMessage({
                            title: "Error",
                            message: "Internal Server Error"
                        })
                    }else{
                        data = await result.json();
                        if(data[0].value == "True"){
                            setPopMessage({
                                title: "Low Callibration",
                                message: "Put High Callibrtion Master in Gauge"
                            })
                            setProgress(75);
                            break;
                        }
                    }
                }

                while (true) {
                     result = await fetch('http://localhost:3006/Fields?field_name="Low"');
                    if (!result.ok) {
                        setPopMessage({
                            title: "Error",
                            message: "Internal Server Error"
                        })
                    }else{
                        var data = await result.json();
                        if(data[0].value == "True"){
                            setPopMessage({
                                title: "Success",
                                message: "Calibration Completed"
                            })
                            setProgress(100);
                            break;
                        }
                    }
                }
            }
            console.log("Hi");
            await sleep(1000);
            setPopupVisible(false);
            result = await fetch('http://localhost:3006/Readings');
            if (!result.ok) {
                setPopMessage({
                    title: "Error",
                    message: "Cannot GET Readings"
                })
                setPopupVisible(true);
            }else{
                data = await result.json();
                var id_readings = []
                var od_readings = []
                await data.forEach(async element => {
                    id_readings.push(element.ID_Reading);
                    od_readings.push(element.OD_Reading);
                })
                id_readings = id_readings.reverse();
                od_readings = od_readings.reverse();
                setID_Readings(id_readings);
                setOD_Readings(od_readings);
            }
            setSuccess(true);
        }
        popUp();

        }, []);
    return (
        <div className="p-3 pb-0 height-fluid position-relative">
            <div className="container text-center dimmed-background ">
                {/* <button onClick={togglePopup} className="btn btn-primary">Toggle Pop-up</button> */}


                {isPopupVisible && (
                    <>
                        <div className="custom-popup bg-dark text-white">
                            <h5 className='mb-3' style={{ fontSize: "5rem" }}>{popMessage.title}</h5>
                            <p className='mb-3' style={{ fontSize: "1.5rem" }}>{popMessage.message}</p>
                            {/* <button onClick={togglePopup} className="btn btn-secondary">Close</button> */}
                            <div className="progress" style={{ height: "1.5rem" }}>
                                <div className="progress-bar progress-bar-striped bg-danger b-5" role="progressbar" style={{ width: `${Progress}%`, height: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div className="backdrop"></div>
                    </>
                )}
            </div>
            <h2>Home</h2>
            <hr className='m-2 mb-3'></hr>
            
            {/* {ID_Readings && <Chart Readings={ID_Readings}></Chart>} */}
            {/* {OD_Readings && <Chart Readings={OD_Readings}></Chart>}       */}
            {Success && <FullWidthTabs width="fluid" height="" id_readings={ID_Readings} od_readings={OD_Readings}/>}
            {/* <p>ID_READING : {ID_Readings[ID_Readings.length-1]} OD_READING : {OD_Readings[OD_Readings.length-1]}</p> */}
            
        </div>
    )
}