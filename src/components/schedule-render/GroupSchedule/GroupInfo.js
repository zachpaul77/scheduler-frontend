import { useRoomsContext, Actions } from "../../../hooks/useRoomsContext"
import { useScheduleContext } from "../../../hooks/useScheduleContext"
// Components
import './GroupSchedule.css'
import MemberName from "../../MemberName"
import { useRef } from "react"

const GroupInfo = (props) => {
    const {room, roomDispatch, selectedGroup} = useRoomsContext()
    const {selectedTimeslots, showMemberNames, setShowMemberNames } = useScheduleContext()
    const dateTime = useRef(['.'])

    const getDateTimeString = (value) => {
        return new Date(value).toLocaleString('en-US', {weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true})
    }

    const getAvailable = () => {
        const availableSelection = []
        const unavailableSet = new Set()
        
        let availableTimeslots = selectedTimeslots.length ? selectedTimeslots : props.available

        if (availableTimeslots.length) {
            availableTimeslots.forEach(colRow => {
                const value = room.timeData.dates[colRow[0]].timeSlots[colRow[1]].value

                props.groupMembers.forEach(m => {
                    if (!m.time_slots.includes(value)) {
                        unavailableSet.add(m.name)
                    }
                })
            })

            props.groupMembers.forEach(m => {
                if (![...unavailableSet].includes(m.name)) {
                    availableSelection.push(m.name)
                }
            })
        }

        dateTime.current = ['.']
        if (availableTimeslots.length) {
            dateTime.current = [getDateTimeString(availableTimeslots[0][2])]
        }
        if (availableTimeslots.length > 1) {
            dateTime.current.push(getDateTimeString(availableTimeslots[availableTimeslots.length-1][2]))
        }

        return availableSelection
    }
    const availableList = getAvailable()


    const deleteGroup = async() => {
        let result = window.confirm(`Are you sure you want to delete group: '${selectedGroup.name}'?`)
        if (!result) return;

        fetch(`/api/room/delete_group/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ groupName: selectedGroup.name }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        
        roomDispatch({type: Actions.DELETE_GROUP, payload: selectedGroup.name})
    }

    return (
        <div className="groupInfo">
            <h4>Group:</h4>
            <h2>{selectedGroup.name}</h2>
            
            <div>{`Total Members: ${props.groupMembers.length}`}</div>
            <button onClick={() => setShowMemberNames(!showMemberNames)}>
                {showMemberNames ? 'Hide Member Names' : 'Show Member Names'}
            </button>
            
            <div className="selectedDateTime" >
                <br />
                {dateTime.current[0]}
                {dateTime.current.length > 1 &&
                    <><br/>{dateTime.current[1]}</>}
            </div>

            <div className="availability">
                <div>Available:</div>
                <div className="displayMembers available" style={{border: selectedTimeslots.length>1 ? '3px solid #ffa952' : ''}}>
                {props.groupMembers.map(m => (
                        <span key={m._id}>
                        {availableList.includes(m.name) &&
                            <span className="memberView">
                                {showMemberNames ?
                                <MemberName member={m} />
                                : <img src={m.profile_img} title={m.name} alt={`member ${m.name}`} height="28px" width="28px"/>}
                            </span>}
                        </span>
                    ))}
                </div>
                
                <div>Unavailable:</div>
                <div className="displayMembers unavailable">
                    {props.groupMembers.map(m => (
                        <span key={m._id}>
                        {!(availableList.includes(m.name)) &&
                            <span className="memberView">
                                {showMemberNames ?
                                <MemberName member={m} />
                                : <img src={m.profile_img} title={m.name} alt={`member ${m.name}`} height="28px" width="28px"/>}
                            </span>}
                        </span>
                    ))}
                </div>
            </div>
                                    
            {selectedGroup.name !== 'All' &&
                <button className="fullwidth deleteButton" onClick={deleteGroup}>delete</button>}
        </div>
    )

}

export default GroupInfo