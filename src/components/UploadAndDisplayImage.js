import React, { useState } from "react";
import { useRoomsContext, Actions } from "../hooks/useRoomsContext"
import { serverDomain } from "../utils/util"
import axios from 'axios'
import { getRandomProfileImg } from "../utils/util";

const UploadAndDisplayImage = ({ member, profileImg }) => {
    const {room, memberDispatch} = useRoomsContext()
    const [selectedImage, setSelectedImage] = useState(member ? member.profile_img : null)

    const onChangeImg = async(e) => {
        const file = e.target.files[0]

        if (file.type.split('/')[0] === 'image') {
            if (member) {
                const formData = new FormData()
                const fileName = member._id
                formData.append('image', file, fileName)
                axios.post(`${serverDomain}/api/room/update_member_img/${room._id}`, formData)
                    .then(res => {
                        memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: res.data, member: member})
                    })
            }
            else if (profileImg) {
                profileImg.current = file
            }

            setSelectedImage(URL.createObjectURL(file))
        } else {
            e.preventDefault()
        }
    }

    const removeImg = () => {
        setSelectedImage(null)
        
        if (member) {
            const newProfileImg = getRandomProfileImg()
            axios.post(`${serverDomain}/api/room/clear_member_img/${room._id}`, {newProfileImg, memberId: member._id})
            .then(res => {
                memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: newProfileImg, member: member})
            })
        }
        else if (profileImg) {
            profileImg.current = null
        }
    }

  return (
    <div>
        {selectedImage && (
                <div>
                    <img alt="not found" width="75px" height="75px" src={selectedImage} />
                    <button onClick={removeImg}>Remove</button>
                </div>)}

        {!selectedImage &&
            <div>
                {!member &&
                    <label>(Optional) Profile picture:</label>}
                <input
                    type="file"
                    name="myImage"
                    id="files"
                    value=""
                    onChange={onChangeImg} />
            </div>}
    </div>
  );
};

export default UploadAndDisplayImage;