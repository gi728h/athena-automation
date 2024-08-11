/* eslint-disable no-constant-condition */
import { useEffect, useState } from 'react';
import '../assets/pop.css';
export default function Home() {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popMessage, setPopMessage] = useState({
        title: "",
        message: ""
    });
    const [Progress, setProgress] = useState(0);
    const [Readings, setReadings] = useState(null);


    useEffect(() => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function popUp() {
            var result = await fetch('http://localhost:3003/test');
            if (!result.ok) {
                setPopMessage({
                    title: "Error",
                    message: "Failed to connect to database"
                })
                setPopupVisible(true);
            } else {
                setPopMessage({
                    title: "High Callibration",
                    message: "Put High Callibrtion Master in Gauge"
                })
                setProgress(25);
                setPopupVisible(true);
                while (true) {
                     result = await fetch('http://localhost:3003/Fields?field_name="High"');
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
                                message: "Put Low Callibrtion Master in Gauge"
                            })
                            setProgress(50);
                            break;
                        }
                    }
                }

                while (true) {
                    result = await fetch('http://localhost:3003/Fields?field_name="Low"');
                    if (!result.ok) {
                        setPopMessage({
                            title: "Error",
                            message: "Internal Server Error"
                        })
                    }else{
                        data = await result.json();
                        if(data[0].value == "True"){
                            setPopMessage({
                                title: "Zero Callibration",
                                message: "Put Zero Callibrtion Master in Gauge"
                            })
                            setProgress(75);
                            break;
                        }
                    }
                }

                while (true) {
                     result = await fetch('http://localhost:3003/Fields?field_name="Zero"');
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
            result = await fetch('http://localhost:3003/Fields?field_name="READINGS"');
            if (!result.ok) {
                setPopMessage({
                    title: "Error",
                    message: "Cannot GET Readings"
                })
                setPopupVisible(true);
            }else{
                data = await result.json();
                setReadings(data[0].value);
            }
        }
        popUp();

        }, []);
    return (
        <div className="p-5 position-relative">
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
            <hr></hr>

            {Readings && <h4>Readings: {Readings}</h4>}
        </div>
    )
}