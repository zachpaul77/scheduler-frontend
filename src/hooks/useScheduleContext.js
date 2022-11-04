import { ScheduleContext } from "../context/ScheduleContext"
import { useContext } from "react"

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext)

  if(!context) {
    throw Error('useScheduleContext must be used inside a ScheduleContextProvider')
  }

  return context
}