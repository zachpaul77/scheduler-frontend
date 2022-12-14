import React, { useState } from "react";
import { useRoomsContext, Actions } from "../hooks/useRoomsContext"
import axios from 'axios'
import { cloudinaryUpload, getRandomProfileImg } from "../utils/util";

const UploadAndDisplayImage = ({ member, profileImg }) => {
    const {room, memberDispatch} = useRoomsContext()
    const [selectedImage, setSelectedImage] = useState(member ? member.profile_img : null)

    const onChangeImg = async(e) => {
        const file = e.target.files[0]
        if (file.type.split('/')[0] === 'image') {
            const localURL = URL.createObjectURL(file)
            setSelectedImage(localURL)
            if (member) {
                const secure_url = await cloudinaryUpload(member._id, room._id, file)
                memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: secure_url, member})
            }
            else if (profileImg) {
                profileImg.current = file
            }

        } else {
            e.preventDefault()
        }
    }

    const removeImg = () => {
        setSelectedImage(null)
        
        if (member) {
            const newProfileImg = getRandomProfileImg()
            memberDispatch({type: Actions.UPDATE_MEMBER_IMG, payload: newProfileImg, member: member})
            axios.post(`/api/room/clear_member_img/${room._id}`, {newProfileImg, memberId: member._id})
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