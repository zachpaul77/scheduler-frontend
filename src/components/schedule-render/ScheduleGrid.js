import React, { useEffect, useRef } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
import { useScheduleContext } from "../../hooks/useScheduleContext"
// Components
import ClickableBox from "./ClickableBox"
import './ScheduleGrid.css'

export const ScheduleGrid = React.memo((props) => {
    const {room, roomDispatch} = useRoomsContext()
    const {selectedTimeslots, setSelectedTimeslots, saveMemberSchedule } = useScheduleContext()
    const clickedSlot = useRef(null)
    const renderReady = useRef(false)
    
    // Update total members and timeSlots' memberCount
    useEffect(() => {
        if (selectedTimeslots.length) { setSelectedTimeslots([]) }

        const newTimeData = room.timeData
        newTimeData.totalMemberCount = 0

        newTimeData.dates.forEach((date, i) => {
            date.timeSlots.forEach((timeSlot, j) => {
                if (!timeSlot.ignored) {
                    let memberCount = getMemberCount(timeSlot.value)
                    newTimeData.dates[i].timeSlots[j].memberCount = memberCount
                }
            })
        })

        renderReady.current = true
        roomDispatch({type: Actions.SET_TIMEDATA, payload: newTimeData})
    }, [])

    const getMemberCount = (date) => {
        let memberCount = 0
        // Fill slots for single member page
        if (props.member) {
            if (props.member.time_slots.includes(date)) {
                memberCount = -1
            }
        // Fill slots for all members in group
        } else if (props.groupMembers.length) {
            props.groupMembers.forEach((m) => {
                if (m.time_slots.includes(date)) {
                    memberCount += 1
                }
            })
            if (memberCount > room.timeData.totalMemberCount) {
                room.timeData.totalMemberCount = memberCount
            }
        }
        return memberCount
    }

    const onMouseLeave = async(isMouseUp) => {
        // Save Member times
        if (props.editable && clickedSlot.current !== null) {
            saveMemberSchedule(clickedSlot.current.isSet, props.member)            
            clickedSlot.current = null
        }
        // Hide all available members
        else if (!isMouseUp && props.isGroupSchedule) {
            props.setAvailable([])
        }
    }

    return (
        <>{renderReady.current &&
        <div className="scheduleGrid" style={{gridTemplateColumns: `repeat(${room.timeData.dates.length+1}, auto)`}}>
            <div className="columnWrapper" onMouseLeave={() => onMouseLeave(false)}>
            {room.timeData && room.timeData.dates.map((date, i) => (

                <div key={i} className={`noSelect stickyLeft ${date.horizontalBreak ? 'horizBreak' : ''}`}>

                {<div className='clickableBox weekdayWrapper '>
                    <div className="monthdate">
                        {new Date(date.timeSlots[0].value).toLocaleString('en-US', {day: 'numeric', month: 'short'})}
                    </div>
                    <div className="weekday">
                        {new Date(date.timeSlots[0].value).toLocaleString('en-US', {weekday: 'short'})}
                    </div>
                </div>}
                
                <div className={'day'}>
                    {date.timeSlots.map((timeSlot, j) => (
                        <ClickableBox
                            key={j}
                            isGroupSchedule={props.isGroupSchedule}
                            setAvailable={props.setAvailable}
                            timeSlot={timeSlot}
                            editable={timeSlot.ignored ? false : props.editable}
                            isSet={timeSlot.memberCount !== 0}
                            clickedSlot={clickedSlot}
                            onMouseLeave={onMouseLeave}
                            selectionInProgress={selectedTimeslots.some(data => data[0]===i && data[1]===j )}
                            indexes={[i, j]} />
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>

        }</>
    )
})
