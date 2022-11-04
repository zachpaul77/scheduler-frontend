import { useState } from "react"
import './MemberSchedule.css'
// Components
import { ScheduleGrid } from "../ScheduleGrid"
import MemberInfo from "./MemberInfo"

const MemberSchedule = (props) => {
    const [editable, setEditable] = useState(false)

    return (
        <div className="memberSchedule" style={{background: editable ? '#f2f3f4' : 'white'}}>
            <MemberInfo
                member={props.member}
                editable={editable}
                setEditable={setEditable}
                showMainSchedule={props.showMainSchedule} />

            <div className="memberScheduleGrid">
                <ScheduleGrid
                    isMemberSchedule={true}
                    editable={editable}
                    member={props.member} />
            </div>
        </div>
    )
}

export default MemberSchedule