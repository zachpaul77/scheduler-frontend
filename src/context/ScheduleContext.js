import { createContext, useState } from 'react'
import { useRoomsContext, Actions } from '../hooks/useRoomsContext'

export const ScheduleContext = createContext()

export const ScheduleContextProvider = ({ children }) => {
  const {room, memberDispatch} = useRoomsContext()
  const [selectedTimeslots, setSelectedTimeslots] = useState([])
  const [showMemberNames, setShowMemberNames] = useState(true)

  const saveMemberSchedule = async (isSet, member, selectList) => {
    // Save Member times
    const dateTimes = []
    let selectedTimeslots2
    if (selectList) {
      selectedTimeslots2 = selectList
    } else {
      selectedTimeslots2 = selectedTimeslots
    }

    selectedTimeslots2.forEach(colRow => {
      room.timeData.dates[colRow[0]].timeSlots[colRow[1]].memberCount = isSet ? -1 : 0
      dateTimes.push(room.timeData.dates[colRow[0]].timeSlots[colRow[1]].value)
    })
    setSelectedTimeslots([])

    const timeSlots = { timeSlots: { dateTimes: dateTimes, isSet: isSet, memberId: member._id } }
    
    // Send updated member times to server
    const response = await fetch(`/api/room/set_member_schedule/${room._id}`, {
      method: 'POST',
      body: JSON.stringify(timeSlots),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    
    if (response.ok) {
      memberDispatch({ type: Actions.SET_MEMBER_SCHEDULE, payload: json, member: member })
    }
  }

  return (
    <ScheduleContext.Provider value={{
      saveMemberSchedule,
      selectedTimeslots, setSelectedTimeslots,
      showMemberNames, setShowMemberNames
    }}>
      {children}
    </ScheduleContext.Provider>
  )

}