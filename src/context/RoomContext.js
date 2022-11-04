import { createContext, useReducer } from 'react'
import { Actions } from '../hooks/useRoomsContext'
import { fixScheduleTimezone } from '../utils/timeUtil'
import { sortObjByKey } from '../utils/util'

export const RoomsContext = createContext()

export const roomsReducer = (state, action) => {

  switch (action.type) {
    case Actions.GET_ALL_ROOMS:
      return {
        rooms: action.payload
      }
    case Actions.CREATE_ROOM:
      return {
        rooms: [action.payload, ...state.rooms]
      }
    case Actions.DELETE_ROOM:
      return {
        rooms: state.rooms.filter((room) => room._id !== action.payload._id)
      }
    case Actions.GET_ROOM:
      action.payload.timeData = fixScheduleTimezone(action.payload.schedule)
      delete action.payload.schedule
      delete action.payload.members
      return {
        room: action.payload,
        selectedGroup: action.payload.groups[0]
      }
    case Actions.SET_SELECTED_GROUP:
      return {
        ...state, selectedGroup: action.payload
      }
    case Actions.CREATE_GROUP:
      state.room.groups.push(action.payload)
      return {
        ...state
      }
    case Actions.DELETE_GROUP:
      state.room.groups = state.room.groups.filter(group => group.name !== action.payload)
      return {
        ...state,
        selectedGroup: state.room.groups[0]
      }
    case Actions.SET_SCHEDULE:
      state.room.timeData = fixScheduleTimezone(action.payload)
      return {
        room: state.room,
        selectedGroup: state.room.groups[0]
      }

    case Actions.SET_TIMEDATA:
      state.room.timeData = action.payload
      return {
        ...state
      }

    default:
      return state
  }
}


export const membersReducer = (state, action) => {

  let mIndex

  switch (action.type) {
    case Actions.GET_ALL_MEMBERS:
      sortObjByKey(action.payload, 'name')
      return {
        members: action.payload
      }
    case Actions.CREATE_MEMBER:
      return {
        members: [action.payload, ...state.members]
      }
    case Actions.SET_MEMBER_SCHEDULE:
      mIndex = state.members.indexOf(action.member)
      state.members[mIndex].time_slots = action.payload
      return {
        members: state.members
      }
    case Actions.UPDATE_MEMBER_GROUPS:
      mIndex = state.members.indexOf(action.member)
      state.members[mIndex].groups = action.payload
      return {
        members: state.members
      }
    case Actions.UPDATE_MEMBER_IMG:
      mIndex = state.members.indexOf(action.member)
      state.members[mIndex].profile_img = action.payload
      return {
        members: state.members
      }
    case Actions.DELETE_ALL_TIMEDATA:
      state.members.forEach(member => member.time_slots = [])
      return {
        members: state.members
      }
    case Actions.DELETE_MEMBER:
      return {
        members: state.members.filter(member => member._id !== action.payload)
      }
    default:
      return state
  }
}

export const RoomsContextProvider = ({ children }) => {
  const [roomState, roomDispatch] = useReducer(roomsReducer, {
    rooms: null,
    room: null,
    selectedGroup: null
  })

  const [memberState, memberDispatch] = useReducer(membersReducer, {
    members: null
  })

  return (
    <RoomsContext.Provider value={{...roomState, roomDispatch, ...memberState, memberDispatch}}>
      { children }
    </RoomsContext.Provider>
  )
}