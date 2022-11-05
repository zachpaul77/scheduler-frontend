import { useRoomsContext, Actions } from '../hooks/useRoomsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RoomDetails = ({ room }) => {
  const { roomDispatch } = useRoomsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleClickDelete = async () => {
    if (!user) return
    let result = window.confirm(`Are you sure you want to delete room: '${room.name}'?`)
    if (!result) return

    const response = await fetch(`/api/room/${room._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      roomDispatch({type: Actions.DELETE_ROOM, payload: json})
    }
  }

  return (
    <div className="roomOverview" >
      <div className='enterRoom' onClick={() => {navigate(`/${room._id}`)}} >
        <h4 >{room.name}</h4>
        <div className='nameList'>
          <strong>Groups: </strong>
            {room.groups.map((group, i) => (
              <span key={group._id}>{group.name + ', '}</span>
            ))}
        </div>
        <div className='nameList'>
          <strong>Members: </strong>
            {room.members.map((member, i) => (
              <span key={member._id}>{member.name + ', '}</span>
            ))}
        </div>
        <p>Updated {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}</p>
      </div>

      <button className="deleteButton" onClick={handleClickDelete}>delete</button>
    </div>
  )
}

export default RoomDetails