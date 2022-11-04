// Components
import { useState } from 'react'
import {ScheduleGrid} from "../ScheduleGrid"
import './GroupSchedule.css'
import GroupInfo from "./GroupInfo"

const GroupSchedule = (props) => {
    const [available, setAvailable] = useState([])
    
    return (
        <div className="groupSchedule">
            <GroupInfo
                groupMembers={props.groupMembers}
                available={available} />
        
            <div className="groupScheduleGrid">
                <ScheduleGrid
                    isGroupSchedule={true}
                    editable={false}
                    groupMembers={props.groupMembers}
                    setAvailable={setAvailable}
                />
            </div>
        </div>
    )
}

export default GroupSchedule