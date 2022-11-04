const getPrevDay = (date) => { return date - 86400000 }
const getNextDay = (date) => { return date + 86400000 }
const addOneHour = (date) => { return date + 3600000 }
const add15min = (date) => { return date + 900000 }


const getPmOffsetDateInfo = (data, isFirstDay, startDay) => {
    const dateInfo = {
        timeSlots: [],
        horizontalBreak: data.lastDayInSequence
    }
    if (isFirstDay) { dateInfo.hourList = [] }
    
    // Get AM time slots
    let date = new Date(data.date)
    date.setHours(0,0,0,0)
    date = date.getTime()
    for (let i=0; i<data.amHours; i++) {
        if (isFirstDay) { dateInfo.hourList.push(date) }

        for (let j=0; j<=45; j+=15) {
            let ignored = false
            if (startDay && i<data.amHours) {
                ignored = true
            }
            if (data.minuteOffset) {
                if (i==data.amHours-1 && j>=data.minuteOffset) {
                    ignored = true
                }
            }
            dateInfo.timeSlots.push({
                value: date,
                ignored: ignored,
                memberCount: 0
            })
            date = add15min(date)
        }
    }

    // Get PM time slots
    date = new Date(data.date)
    date.setMinutes(0)
    date = date.getTime()

    for (let i=0; i<data.pmHours; i++) {
        if (isFirstDay) { dateInfo.hourList.push(date) }

        for (let j=0; j<=45; j+=15) {
            let ignored = false
            if (data.lastDayInSequence && i<data.pmHours) {
                ignored = true
            }
            if (data.minuteOffset) {
                if (i==0 && j<data.minuteOffset) {
                    ignored = true
                }
            }
            dateInfo.timeSlots.push({
                value: date,
                ignored: ignored,
                memberCount: 0
            })
            date = add15min(date)
        }
    }

    return dateInfo
}

const getDateInfo = (data, isFirstDay) => {
    const dateInfo = {
        timeSlots: [],
        horizontalBreak: data.lastDayInSequence
    }
    if (isFirstDay) { dateInfo.hourList = [] }
    
    let date = new Date(data.date)
    date.setMinutes(0)
    date = date.getTime()
    
    for (let i=0; i<data.totalTime; i++) {
        if (isFirstDay) { dateInfo.hourList.push(date) }

        for (let j=0; j<=45; j+=15) {
            let ignored = false
            if (data.minuteOffset) {
                if ((i==0 && j<data.minuteOffset) || (i==data.totalTime-1 && j>=data.minuteOffset)) {
                    ignored = true
                }
            }
            dateInfo.timeSlots.push({
                value: date,
                ignored: ignored,
                memberCount: 0
            })
            date = add15min(date)
        }
    }

    return dateInfo
}


export const fixScheduleTimezone = (schedule) => {
    const times = schedule.times
    const dates = schedule.dates
    const initialDate = new Date(dates[0])

    const timeData = {
        totalMemberCount: 0,
        dates: [],
        hourList: []
    }
    const data = {
        initialDate: dates[0],
        amHours: initialDate.getHours() + times.total - 24,
        pmHours: 24 - initialDate.getHours(),
        totalTime: times.total,
        lastDayInSequence: false
    }

    // Minute offset
    let minuteOffset = initialDate.getMinutes()
    if (minuteOffset !== 0) {
        data.minuteOffset = minuteOffset
        if (times.total !== 24) {
            if (data.amHours > 0) {
                data.amHours += 1
            } else {
                data.totalTime += 1
            }
        }
    }

    // Get data for each day
    let startDay = 0
    dates.forEach((date, i) => {
        data.date = date
        data.lastDayInSequence = false
        const isFirstDay = (i===0)

        if (date+86400000 !== dates[i+1]) {
            data.lastDayInSequence = true
        }
        if (data.amHours > 0) {
            // Crossover from 11PM to 12AM
            if (data.lastDayInSequence) {
                data.lastDayInSequence = false
                timeData.dates.push(getPmOffsetDateInfo(data, isFirstDay, startDay===i))
                data.date += 86400000
                data.lastDayInSequence = true
                startDay = i+1
            }
            timeData.dates.push(getPmOffsetDateInfo(data, isFirstDay, startDay===i))
        }
        else {
            timeData.dates.push(getDateInfo(data, isFirstDay))
        }

        // Move hourList to timeData obj
        if (isFirstDay) {
            timeData.hourList = timeData.dates[0].hourList
            delete timeData.dates[0].hourList
        }
    })

    return timeData
}
