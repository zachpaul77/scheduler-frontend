import './SelectGroups.css'
import { useRoomsContext } from '../hooks/useRoomsContext'
import { useState } from 'react';

const SelectGroups = ({ isEditable, selectedGroups, onClickGroup }) => {
    const {room} = useRoomsContext()
    const [,forceUpdate]=useState()

    const handleClick = (e) => {
        e.preventDefault()
        if (!isEditable) return

        if (selectedGroups.current.includes(e.target.textContent)) {
            selectedGroups.current = selectedGroups.current.filter(groupName => groupName !== e.target.textContent)
        } else {
            selectedGroups.current = [...selectedGroups.current, e.target.textContent]
        }

        if (onClickGroup) {
            onClickGroup()
        } else {
            forceUpdate({})
        }
    }

    const isSelected = (group) => {
        if (selectedGroups.current.includes(group.name)) {
            return 'selected'
        }
        return ''
    }

    return (
        <div className="selectGroups">

            {room.groups.length > 1 &&
            <div className="groupList">
                <label>Groups:</label>
                {room.groups.map((group) => (
                    !group.all &&
                    <div className={`selectGroup noSelect ${isSelected(group)}`} key={group._id} onMouseDown={handleClick} >
                        {group.name}
                    </div>
                ))}
            </div>}
            
        </div>
    )
}

export default SelectGroups