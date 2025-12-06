import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const useTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return {
        fullDate: format(time, 'yyyy년 MM월 dd일', { locale: ko }),
        timeString: format(time, 'HH:mm'),
        isNight: time.getHours() >= 18 || time.getHours() < 6
    };
};
