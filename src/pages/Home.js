import { useEffect, useState } from 'react'
import { useRoomsContext, Actions } from "../hooks/useRoomsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import './Home.css'
// components
import RoomDetails from '../components/RoomDetails'
import RoomCreate from '../components/RoomCreate'

const Home = () => {
  const {rooms, roomDispatch} = useRoomsContext()
  const [loadingRooms, setLoadingRooms] = useState("Loading rooms...");
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch(`/api/room/rooms`, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setLoadingRooms(null)
        roomDispatch({type: Actions.GET_ALL_ROOMS, payload: json})
      } else {
        setLoadingRooms("Error loading rooms.")
      }
    }

    if (user) {
      fetchRooms()
    }
  }, [roomDispatch, user])

  return (
    <div className="homePage">

      {loadingRooms ? <h2>{loadingRooms}</h2> :
        <>
          <div className='addRoom'>
            <RoomCreate />
          </div>

          <div className="roomsList">
            {rooms && rooms.map((room) => (
              <RoomDetails key={room._id} room={room} />
            ))}
          </div>
        </>
      }

    </div>
  )
}

export default Home