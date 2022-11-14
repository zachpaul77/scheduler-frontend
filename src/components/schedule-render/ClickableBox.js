import { useRoomsContext } from "../../hooks/useRoomsContext"
import { useScheduleContext } from "../../hooks/useScheduleContext"

const black = [105, 105, 105]
const white = [255, 255, 255]
const blue = [0, 102, 153]
const purple = "#004264"

const ClickableBox = ({ timeSlot, editable, isSet, clickedSlot, onMouseLeave, selectionInProgress, isGroupSchedule, setAvailable, indexes }) => {
    const {room} = useRoomsContext()
    const { selectedTimeslots, setSelectedTimeslots } = useScheduleContext()

    const getOpacity = () => {
        if (timeSlot.memberCount <= 0) { return 1 }
        return ((timeSlot.memberCount+1) / room.timeData.totalMemberCount)
    }

    const getColor = () => {
        if (timeSlot.ignored) {
            return `rgb(${black})`
        }
        if (selectionInProgress && editable) {
            return clickedSlot.current.isSet ? `rgb(${blue})` : `rgb(${white})`
        }
        if (isSet) {
            if (timeSlot.memberCount === room.timeData.totalMemberCount) {
                return purple
            }
            return `rgba(${blue}, ${getOpacity()})`
        }

        return `rgb(${white})`
    }

    const onMouseDown = () => {
        if (!editable && !isGroupSchedule) return
        
        if (selectedTimeslots.length) {
            setSelectedTimeslots([])
        } else if (!timeSlot.ignored) {
            setSelectedTimeslots([[indexes[0], indexes[1], timeSlot.value]])
        }

        clickedSlot.current = {indexes: [indexes[0], indexes[1]], isSet: !isSet}
    }

    const getClassName = () => {
        let result = ''
        if (indexes[1] === 0) {
            result += 'weekdayBox '
        }
        if ((indexes[1] + 1) % 4 === 0) {
            result += 'hourBorder '
        } else if ((indexes[1] + 1) % 2 === 0) {
            result += 'halfHourBorder '
        }

        if (isGroupSchedule && selectionInProgress) {
            result += 'selectBorder'
        }

        return result
    }

    const onMouseEnter = (e) => {
        if (e.nativeEvent.buttons === 1 && clickedSlot.current !== null) {
            // loop through all timeslots and add / remove based on if ignored or in range
            let startCol = clickedSlot.current.indexes[0]
            let startRow = clickedSlot.current.indexes[1]
            let endCol = indexes[0]
            let endRow = indexes[1]
            
            // swap variables if start is larger
            if (startCol > endCol) {
                [startCol, endCol] = [endCol, startCol] 
            }
            if (startRow > endRow) {
                [startRow, endRow] = [endRow, startRow]
            }
            
            const selectedTimes = []
            for (let i=startCol; i<=endCol; i++) {
                for (let j=startRow; j<=endRow; j++) {
                    if (!room.timeData.dates[i].timeSlots[j].ignored) {
                        const memberCount = room.timeData.dates[i].timeSlots[j].memberCount

                        if (isGroupSchedule) {
                            if ((i===startCol && j===startRow) || (i===endCol && j===endRow)) {
                                selectedTimes.push([i, j, room.timeData.dates[i].timeSlots[j].value])
                            } else {
                                selectedTimes.push([i, j])
                            }
                        }
                        else if (memberCount === -1 && !clickedSlot.current.isSet) {
                            selectedTimes.push([i, j])
                        }
                        else if (memberCount === 0 && clickedSlot.current.isSet) {
                            selectedTimes.push([i, j])
                        }
                    }
                }
            }

            setSelectedTimeslots(selectedTimes)
        }
    }

    const updateAvailableMembers = (e) => {
        if (!isGroupSchedule) return
        setAvailable([[indexes[0], indexes[1], timeSlot.value]])
    }

    return (
        <div
        className={`clickableBox ${getClassName()}`}
        style={{background: getColor()}}
        onMouseEnter={e => onMouseEnter(e)}
        onMouseUpCapture={() => onMouseLeave(true)}
        onMouseDownCapture={onMouseDown}
        onMouseOverCapture={updateAvailableMembers}
        >
            {indexes[0] === 0 && (indexes[1]) % 4 === 0 &&
                <div className="times">
                    {new Date(room.timeData.hourList[indexes[1]/4]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </div>}

        </div>
    )
}

export default ClickableBox