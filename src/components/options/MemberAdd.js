import { useState, useRef } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
import axios from 'axios'
import { serverDomain } from "../utils/util"
//import { useAuthContext } from '../../hooks/useAuthContext'
// Components
import './MemberAdd.css'
import SelectGroups from "../SelectGroups"
import UploadAndDisplayImage from "../UploadAndDisplayImage"
import { getRandomProfileImg } from "../../utils/util"


const MemberAdd = ({ room, showMainSchedule }) => {
    //const { user } = useAuthContext()
    const { memberDispatch } = useRoomsContext()
    const [error, setError] = useState(null)
    const selectedGroups = useRef([])
    const memberName = useRef(null)
    const profileImg = useRef(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const member = {name: memberName.current,
                        groups: selectedGroups.current,
                        profile_img: getRandomProfileImg()}

        const response = await fetch(`${serverDomain}/api/room/create_member/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ member }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        
        if (!response.ok) {
            if (json.error) {
                setError(json.error)
            } else {
                setError("Problem adding the member")
            }
        }
        if (response.ok) {
            memberDispatch({type: Actions.CREATE_MEMBER, payload: json})
            if (profileImg.current) {
                const formData = new FormData()
                const fileName = json._id
                formData.append('image', profileImg.current, fileName)
                axios.post(`${serverDomain}/api/room/update_member_img/${room._id}`, formData)
                    .then(res => {
                        memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: res.data, member: json})
                    })
            }

            showMainSchedule()
        }
    }

    const nameChange = (e) => {
        memberName.current = e.target.value
    }

    return (
        <div className="memberAdd">
            <h1>Create a member</h1>

            <form className="addMemberForm" onSubmit={e => handleSubmit(e)}>
                <label>Name:</label>
                <input
                    name="name"
                    type="text"
                    onChange={nameChange}
                    required
                />

                <UploadAndDisplayImage profileImg={profileImg} />
                <SelectGroups isEditable={true} selectedGroups={selectedGroups} />
                
                <div>
                    <button>Submit</button>
                    <button onClick={() => showMainSchedule()}>Cancel</button>
                </div>
            </form>
            
            {error && <div className="error">{error}</div>}
        </div>
    )
}

export default MemberAdd