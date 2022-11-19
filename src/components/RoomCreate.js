import { useState } from "react"
import { useRoomsContext, Actions } from "../hooks/useRoomsContext"
import { useAuthContext } from '../hooks/useAuthContext'

const RoomCreate = () => {
  const { roomDispatch } = useRoomsContext()
  const { user } = useAuthContext()

  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const date = new Date()
    date.setHours(7, 0, 0, 0)
    // If Fri or Sat, get next week
    if ([5, 6].includes(date.getDay())) {
      date.setTime(date.getTime()+604800000)
    }
    // Set default dates to weekend
    const dates = []
    for (let i=0; i<5; i++) {
      date.setDate(date.getDate() + (5-date.getDay()))
      dates.push(date.getTime())
      date.setDate(date.getDate() + (6-date.getDay()))
      dates.push(date.getTime())
      date.setDate(date.getDate() + (7-date.getDay()))
      dates.push(date.getTime())
    }

    const schedule = {
      times: {
        begin: 7,
        end: 23,
        total: 17
      },
      dates: dates
    }

    const response = await fetch(`/api/room/create`, {
      method: 'POST',
      body: JSON.stringify({roomName, schedule}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setRoomName('')
      setError(null)
      roomDispatch({type: Actions.CREATE_ROOM, payload: json})
    }
  }

  return (
    <form className="roomCreate" onSubmit={handleSubmit}>
      <h2>Add New Room</h2>

      <input
        type="text"
        onChange={(e) => setRoomName(e.target.value)}
        value={roomName}
        className={"error"}
        required={true}
        placeholder="Room name"
      />

      <button>Add Room</button>
      {error && <div className="errorMsg">{error}</div>}
    </form>
  )
}

export default RoomCreate