import { RoomsContext } from '../context/RoomContext'
import { useContext } from 'react'

export const Actions = {
  GET_ALL_ROOMS: "GET_ALL_ROOMS",
  CREATE_ROOM: "CREATE_ROOM",
  GET_ROOM: "GET_ROOM",
  SET_SELECTED_GROUP: "SET_SELECTED_GROUP",
  DELETE_ROOM: "DELETE_ROOM",
  CREATE_GROUP: "CREATE_GROUP",
  DELETE_GROUP: "DELETE_GROUP",
  SET_SCHEDULE: "SET_SCHEDULE",
  SET_TIMEDATA: "SET_TIMEDATA",
  GET_ALL_MEMBERS: "GET_ALL_MEMBERS",
  CREATE_MEMBER: "CREATE_MEMBER",
  SET_MEMBER_SCHEDULE: "SET_MEMBER_SCHEDULE",
  UPDATE_MEMBER_GROUPS: "UPDATE_MEMBER_GROUPS",
  UPDATE_MEMBER_IMG: "UPDATE_MEMBER_IMG",
  DELETE_MEMBER: "DELETE_MEMBER",
  DELETE_ALL_TIMEDATA: "DELETE_ALL_TIMEDATA"
}

export const useRoomsContext = () => {
  const context = useContext(RoomsContext)

  if (!context) {
    throw Error('useRoomsContext must be used inside an RoomsContextProvider')
  }

  return context
}