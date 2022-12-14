import { useState, useRef } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
//import { useAuthContext } from '../../hooks/useAuthContext'
// Components
import './MemberAdd.css'
import SelectGroups from "../SelectGroups"
import UploadAndDisplayImage from "../UploadAndDisplayImage"
import { cloudinaryUpload, getRandomProfileImg } from "../../utils/util"


const MemberAdd = ({ showMainSchedule }) => {
    //const { user } = useAuthContext()
    const { room, memberDispatch } = useRoomsContext()
    const [error, setError] = useState(null)
    const [creatingMember, setCreatingMember] = useState(false)
    const selectedGroups = useRef([])
    const memberName = useRef(null)
    const profileImg = useRef(null)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setCreatingMember(true)

        const member = {name: memberName.current,
                        groups: selectedGroups.current,
                        profile_img: getRandomProfileImg()}

        const response = await fetch(`/api/room/create_member/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ member }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        
        if (!response.ok) {
            setCreatingMember(false)
            if (json.error) {
                setError(json.error)
            } else {
                setError("Problem adding the member")
            }
        }
        if (response.ok) {
            memberDispatch({type: Actions.CREATE_MEMBER, payload: json})
            showMainSchedule()
            
            if (profileImg.current) {
                const imgURL = await cloudinaryUpload(json._id, room._id, profileImg.current)
                if (imgURL) { memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: imgURL, member: json}) }
            }
        }
    }

    const nameChange = (e) => {
        memberName.current = e.target.value
    }

    return (
        <div className="memberAdd">

            {!creatingMember ?
            <>
            <form className="addMemberForm" onSubmit={e => handleSubmit(e)}>
                <div>
                    <h1>Create a member</h1>
                </div>
                <input
                    name="name"
                    type="text"
                    onChange={nameChange}
                    required="true"
                    placeholder="Member Name"
                />

                <div>
                    <label>(Optional) Profile picture:</label>
                    <UploadAndDisplayImage profileImg={profileImg} />
                </div>

                <SelectGroups isEditable={true} selectedGroups={selectedGroups} />
                
                <button>Submit</button>
                <button onClick={() => showMainSchedule()}>Cancel</button>
            </form>
            
            {error && <div className="errorMsg">{error}</div>}
            </>
            
            : <h1>Creating member...</h1>}
        </div>
    )
}

export default MemberAdd