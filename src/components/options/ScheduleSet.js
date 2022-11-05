import { useState, useRef } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
import { serverDomain } from "../../utils/util"
//import { useAuthContext } from '../../hooks/useAuthContext'
// Components
import DatePicker from "react-multi-date-picker";
import TimeDropdown from "../TimeDropdown";
import './ScheduleSet.css'


const ScheduleSet = ({ showMainSchedule }) => {
    //const { user } = useAuthContext()
    const { room, roomDispatch, memberDispatch } = useRoomsContext()
    const [error, setError] = useState(null)
    const [dates, setDates] = useState([])
    const removeMemberSchedules = useRef(false)
    const times = useRef({
        begin: 7,
        end: 23,
        total: 17
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        times.current.total = 1 + times.current.end - times.current.begin
        
        // Convert date to epoch time
        const dateTimes = []
        dates.forEach((date) => {
            const newDate = date.toDate()
            newDate.setHours(times.current.begin,0,0,0)
            dateTimes.push(newDate.getTime())
        });
        
        dateTimes.sort()
        
        const response = await fetch(`${serverDomain}/api/room/set_schedule/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({schedule: {dates: dateTimes, times: times.current},
                                  removeMemberSchedules: removeMemberSchedules.current}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        
        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            roomDispatch({type: Actions.SET_SCHEDULE, payload: json})
            if (removeMemberSchedules.current) {
                memberDispatch({type: Actions.DELETE_ALL_TIMEDATA, payload: null}) 
            }
            showMainSchedule()
        }
    }

    const onChangeTime = (name, e) => {
        times.current[name] = Number(e.target.selectedOptions[0].id)
    }

    return (
        <div className="scheduleSet">
            <h1>Set a schedule</h1>

            <form className="scheduleSetForm" onSubmit={e => handleSubmit(e)}>
                <div>
                    <label>Select Dates:</label>
                    <DatePicker multiple={true} onChange={setDates} required={true} showOtherDays={true} />
                </div>
                <div>
                    <label>Times:</label>
                    <span className="selTime">From: </span>
                    <TimeDropdown name="begin" onChange={onChangeTime}/>
                    <span className="selTime"> To: </span>
                    <TimeDropdown name="end" onChange={onChangeTime}/>
                    <br />
                </div>
                <div className="removeMemberSchedules">
                    <input type="checkbox" htmlFor="removeMemberSchedules" id="removeMemberSchedules" onChange={()=>removeMemberSchedules.current = !removeMemberSchedules.current} />
                    <label htmlFor="removeMemberSchedules"> Delete member time data?</label>
                </div>
                
                <div>
                    <button>Submit</button>
                    <button onClick={() => showMainSchedule()}>Cancel</button>
                </div>

                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default ScheduleSet