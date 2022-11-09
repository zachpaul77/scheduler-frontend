import { useState } from "react"
import { useRoomsContext, Actions } from "../../hooks/useRoomsContext"
//import { useAuthContext } from '../../hooks/useAuthContext'
// Components

const GroupAdd = ({ showMainSchedule }) => {
    const { room, roomDispatch } = useRoomsContext()
    //const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [values, setValues] = useState({
        name: null,
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        setCreatingGroup(true)

        const group = {name: values.name}

        const response = await fetch(`/api/room/create_group/${room._id}`, {
            method: 'POST',
            body: JSON.stringify({ group }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const json = await response.json()
        
        if (!response.ok) {
            setCreatingGroup(false)
            if (json.error) {
                setError(json.error)
            } else {
                setError("Problem adding group.")
            }
        }
        if (response.ok) {
            showMainSchedule()
            roomDispatch({type: Actions.CREATE_GROUP, payload: json})
        }
    }

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <div className="member-add">
            {!creatingGroup ?
            <>
            <h1>Create a group</h1>
                
            <form onSubmit={e => handleSubmit(e)}>
                <label>Name:</label>
                <input
                    name="name"
                    type="text"
                    onChange={e => onChange(e)}
                    required
                />

                <br/><br/>
                <button>Submit</button>
                <button onClick={() => showMainSchedule()}>Cancel</button>
            </form>

            {error && <div className="error">{error}</div>}
            </>

            : <h1>Creating group...</h1>}

        </div>
    )
}

export default GroupAdd