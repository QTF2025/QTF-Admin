import dayjs from "dayjs"

export const getWeekDates = (type: string) => {
    const currentDate = new Date().getDate()
    const weekBackFromNow = new Date().setDate(currentDate - 6)
    let startDate = null;
    if(type === 'CURRENT'){
        startDate = dayjs(new Date())
    }else{
        startDate = dayjs(new Date(weekBackFromNow))
    }
    const endDate = dayjs(new Date())
    const queryString: string = `startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`
    return queryString
}