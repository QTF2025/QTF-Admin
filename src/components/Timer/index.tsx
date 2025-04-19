import React, { useState, useEffect } from 'react'
import { getTimeForTimeZone } from '../../utils';

function Timer({ timer }: any) {
    const [time, setTime] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
        setTime(getTimeForTimeZone(timer.timeZone));
        }, 1000); // Update time every second (1000 milliseconds)

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);
  return (
    <>
        {
            time && <div className='sales-data-report__timezones--time'>{timer.title + ' : ' + time}</div>
        }
    </>
  )
}

export default Timer