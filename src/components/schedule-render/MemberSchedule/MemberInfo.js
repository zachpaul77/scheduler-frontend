import { useState, useRef } from "react"
import { useRoomsContext, Actions } from "../../../hooks/useRoomsContext"
import { useScheduleContext } from "../../../hooks/useScheduleContext"
import { serverDomain } from "../utils/util"
// Components
import SelectGroups from "../../SelectGroups"
import UploadAndDisplayImage from "../../UploadAndDisplayImage"
import './MemberSchedule.css'
import MemberName from "../../MemberName"

const MemberInfo = ({ member, editable, setEditable, showMainSchedule}) => {
    const {room, memberDispatch} = useRoomsContext()
    const { setSelectedTimeslots, saveMemberSchedule } = useScheduleContext()
    const [selectAll, setSelectAll] = useState(false)
    const selectedGroups = useRef(member.groups)

    // On update member groups, send to server
    const onClickGroup = async() => {
        if (!editable) return

        const response = await fetch(`${serverDomain}/api/room/update_member_groups/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ groups: selectedGroups.current, memberId: member._id }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (response.ok) {
            memberDispatch({type: Actions.UPDATE_MEMBER_GROUPS, payload: json, member: member})
        }
    }

    const deleteMember = async() => {
        let result = window.confirm(`Delete member: ${member.name}?`)
        if (!result) return;

        const response = await fetch(`${serverDomain}/api/room/delete_member/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ memberId: member._id }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        
        if (response.ok) {
            memberDispatch({type: Actions.DELETE_MEMBER, payload: member._id})
            showMainSchedule()
        }
    }

    const clickSelectAll = () => {
        const selectAllList = []
        room.timeData.dates.forEach((date, i) => {
            date.timeSlots.forEach((timeSlot, j) => {
                if (!timeSlot.ignored) {
                    const hasTimeSlot = member.time_slots.includes(timeSlot.value)

                    // have timeslot and selectallbutton is false
                    if (hasTimeSlot && selectAll) { 
                        selectAllList.push([i, j])
                    }
                    // don't have timeslot and selectallbutton is true
                    else if (!hasTimeSlot && !selectAll) { 
                        selectAllList.push([i, j])
                    }
                }
            })
        })
        
        //setSelectedTimeslots(selectAllList)
        saveMemberSchedule(!selectAll, member, selectAllList)
        setSelectAll(!selectAll)
    }

    return (
        <div className="memberInfo">
            <h2><MemberName member={member} /></h2>
            <div><button className="fullwidth" onClick={() => showMainSchedule()}>Back</button></div>

            {!editable ?
                <button className="fullwidth" onClick={() => {setSelectedTimeslots([]); setEditable(true);}} >
                    Edit
                </button>
                : <div>
                    <button className="fullwidth" onClick={clickSelectAll}>{selectAll ? "Deselect All" : "Select All"}</button>
                    <UploadAndDisplayImage member={member} />
                </div>}

            <br />
            <SelectGroups isEditable={editable} selectedGroups={selectedGroups} onClickGroup={onClickGroup} />
        
            {editable ?
                <button className="fullwidth deleteButton" onClick={deleteMember}>delete</button> : null}
        </div>
    )
}

export default MemberInfo