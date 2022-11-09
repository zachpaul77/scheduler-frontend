export const getRandomProfileImg = () => {
    const list = ['blue', 'brown', 'green', 'magenta', 'orange', 'purple', 'red', 'turquoise']

    return `/images/${list[Math.floor(Math.random() * list.length)]}-square.svg`
}


export const sortObjByKey = (obj, key) => {
    obj.sort((a, b) => {
        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
}


export const cloudinaryUpload = async(memberId, roomId, file) => {
    // Get cloudinary sig from server
    let response = await fetch(`/api/room/get_cloudinary_signature/${roomId}`, {
        method: 'POST',
        body: JSON.stringify({ memberId }),
        headers: {
          'Content-Type': 'application/json'
        }
    })

    const { signature, timestamp } = await response.json()
    if (!response.ok) return false

    // Upload to cloudinary using signature
    const CLOUD_NAME = 'dic3x79bp'
    const API_KEY = '713544398193923'
    const form = new FormData()
    form.append('file', file)
    form.append('folder', `schedule/room/${roomId}`)
    form.append('public_id', memberId)
    form.append('timestamp', timestamp)
    form.append('transformation', 'w_30,h_30')
    response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&signature=${signature}`, {
        method: 'POST',
        body: form,
    })

    const data = await response.json()
    if (!response.ok) return false
    
    // Update img URL on server
    fetch(`/api/room/update_member_img/${roomId}`, {
        method: 'POST',
        body: JSON.stringify({ memberId, imgURL: data.secure_url}),
        headers: {
          'Content-Type': 'application/json'
        }
    })
    
    return data.secure_url
}