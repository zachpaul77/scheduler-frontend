import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRoomsContext, Actions } from "../hooks/useRoomsContext"
import { ScheduleContextProvider } from '../context/ScheduleContext'
//import { useAuthContext } from "../hooks/useAuthContext"
// components
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import './Room.css';
import './Sidebar.css';
import MemberAdd from '../components/options/MemberAdd'
import GroupAdd from '../components/options/GroupAdd'
import ScheduleSet from '../components/options/ScheduleSet'
import GroupSchedule from '../components/schedule-render/GroupSchedule/GroupSchedule'
import MemberSchedule from '../components/schedule-render/MemberSchedule/MemberSchedule'
import MemberName from '../components/MemberName'

const Room = () => {
  const {room, selectedGroup, roomDispatch, members, memberDispatch} = useRoomsContext()
  const { room_id } = useParams()
  const [components, setShowComponent] = useState('mainSchedule')

  // Get room json on page load
  useEffect(() => {
    const fetchRoom = async () => {
      const response = await fetch(`/api/room`, {
        method: 'POST',
        body: JSON.stringify({room_id: room_id}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()

      if (response.ok) {
        memberDispatch({type: Actions.GET_ALL_MEMBERS, payload: json.members})
        roomDispatch({type: Actions.GET_ROOM, payload: json})
      }
    }

    if (!room) {
      fetchRoom()
    }
  }, [])

  const getGroupMembers = () => {
    const groupMembers = []
    members.forEach(m => {
        if (m.groups.some(group => group === selectedGroup.name)) {
            groupMembers.push(m)
        }
    })
    return groupMembers
  }

  const showMainSchedule = () => {
    setShowComponent('mainSchedule')
  }

  const showGroup = (group) => {
    roomDispatch({type: Actions.SET_SELECTED_GROUP, payload: group})
    showMainSchedule()
  }

  const toggleComponent = (name, value) => {
    if (name === 'memberSchedule') {
      setShowComponent({activeMember: value})
    }
    else if (components === name) {
      setShowComponent('mainSchedule')
    }
    else {
      setShowComponent(name)
    }
  }

  return (
    <>{room ?
    <div className="roomPage">
      <ProSidebar >
        <Menu iconShape="square">
          <SubMenu title="Options">
            <MenuItem onClick={() => toggleComponent('addMember')}>Add Member</MenuItem>
            <MenuItem onClick={() => toggleComponent('addGroup')}>Add Group</MenuItem>
            <MenuItem onClick={() => toggleComponent('setSchedule')}>Set Schedule</MenuItem>
          </SubMenu>
          <SubMenu title="Groups">
            {room.groups.map((group) => (
              <MenuItem key={group._id} onClick={() => showGroup(group)}> {group.name} </MenuItem>
            ))}
          </SubMenu>
          {members.map((member) => (
            <MenuItem key={member._id} onClick={() => toggleComponent('memberSchedule', member)}>
              <MemberName member={member} />
            </MenuItem>
          ))}
        </Menu>
      </ProSidebar>

      <div className='roomContent'>
        { components === 'addMember' &&
          <MemberAdd room={room} showMainSchedule={showMainSchedule}/>}

        { components === 'addGroup' &&
          <GroupAdd room={room} showMainSchedule={showMainSchedule}/>}
          
        { components === 'setSchedule' &&
          <ScheduleSet room={room} showMainSchedule={showMainSchedule}/>}

        <ScheduleContextProvider>
          { components === 'mainSchedule' &&
            <GroupSchedule key={selectedGroup._id} groupMembers={getGroupMembers()} showMainSchedule={showMainSchedule} />}
        
          { components.activeMember &&
            <MemberSchedule key={components.activeMember._id} member={components.activeMember} showMainSchedule={showMainSchedule} />}
        </ScheduleContextProvider>

      </div>
    </div>
    
    : <h1>Loading...</h1>}</>
  )

}

export default Room