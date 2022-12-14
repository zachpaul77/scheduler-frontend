import { useState, useRef } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
//import { useAuthContext } from '../../hooks/useAuthContext'
// Components
import DatePicker from "react-multi-date-picker";
import TimeDropdown from "../TimeDropdown";
import './ScheduleSet.css'


const ScheduleSet = ({ showMainSchedule }) => {
    //const { user } = useAuthContext()
    const { room, roomDispatch, memberDispatch } = useRoomsContext()
    const [creatingSchedule, setCreatingSchedule] = useState(false)
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
        setCreatingSchedule(true)
        times.current.total = 1 + times.current.end - times.current.begin
        
        // Convert date to epoch time
        const dateTimes = []
        dates.forEach((date) => {
            const newDate = date.toDate()
            newDate.setHours(times.current.begin,0,0,0)
            dateTimes.push(newDate.getTime())
        });
        
        dateTimes.sort()
        
        const response = await fetch(`/api/room/set_schedule/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({schedule: {dates: dateTimes, times: times.current},
                                  removeMemberSchedules: removeMemberSchedules.current}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        
        if (!response.ok) {
            setCreatingSchedule(false)
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
            {!creatingSchedule ?
            <>
            <form className="scheduleSetForm" onSubmit={e => handleSubmit(e)}>
                <div>
                    <h1>Set a schedule</h1>
                </div>

                <DatePicker multiple={true} onChange={setDates} required={true} showOtherDays={true} placeholder={"Select Dates"}/>
                
                <div>
                    <span className="selTime">From: </span>
                    <TimeDropdown name="begin" onChange={onChangeTime}/>
                    <span className="selTime"> To: </span>
                    <TimeDropdown name="end" onChange={onChangeTime}/>
                </div>
                <div className="removeMemberSchedules">
                    <input type="checkbox" htmlFor="removeMemberSchedules" id="removeMemberSchedules" onChange={()=>removeMemberSchedules.current = !removeMemberSchedules.current} />
                    <label htmlFor="removeMemberSchedules"> Delete member time data?</label>
                </div>
                
                <button>Submit</button>
                <button onClick={() => showMainSchedule()}>Cancel</button>

                {error && <div className="errorMsg">{error}</div>}
            </form>
            </>

            : <h1>Setting schedule...</h1>}

        </div>
    )
}

export default ScheduleSet