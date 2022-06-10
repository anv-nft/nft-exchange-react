import React, { useEffect, useState } from "react";


function CountDownTimer({ deadline }) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const leading0 = (num) => {
        return num < 10 ? "0" + num : num;
    };

    const getTimeUntil = (deadline) => {
        const time = Date.parse(deadline) - Date.parse(new Date());
        if (time < 0) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
        } else {
            setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
            setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((time / 1000 / 60) % 60));
            setSeconds(Math.floor((time / 1000) % 60));
        }
    };

    useEffect(() => {
        setInterval(() => getTimeUntil(deadline), 1000);

        return () => getTimeUntil(deadline);
    }, [deadline]);

    return (
        <div className="countdowntimer">
            <div className="Clock-days timer_box">
                <div className="timer_box_inner">{leading0(days)}</div> <div>Days</div>
            </div>
            <div className="Clock-hours timer_box">
                <div className="timer_box_inner">{leading0(hours)}</div> <div>Hours</div>
            </div>
            <div className="Clock-minutes timer_box">
                <div className="timer_box_inner">{leading0(minutes)}</div> <div>Mins</div>
            </div>
            <div className="Clock-seconds timer_box">
                <div className="timer_box_inner">{leading0(seconds)}</div> <div>Secs</div>
            </div>
        </div>
    )
}

export default CountDownTimer
