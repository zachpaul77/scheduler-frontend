
const TimeDropdown = ({ name, onChange }) => {
  const getTimes = () => {
    let ampm = ':00 AM'
    let timeArray = []
    let time = 12
    
    while(true) {
      if (timeArray.length === 24) break

      if (time === 12) {
        if (timeArray.length === 0) {
          timeArray.push(time + ampm)
          time=1
        } else {
          ampm = ':00 PM'
          timeArray.push(time + ampm)
          time = 1
        }
      }
      timeArray.push(time + ampm)
      time++
  }

  let fullTimeArray = []
  for (let i=0; i<timeArray.length; i++) {
    fullTimeArray.push({value: i, display: timeArray[i]})
  }

  return fullTimeArray
  }

  const getDefaultValue = () => {
    return name==='begin' ? '7:00 AM' : '11:00 PM'
  }

  return (
    <select className="timeDropdown" name={name} defaultValue={getDefaultValue()} onChange={(e) => onChange(name, e)} >
      {
        getTimes().map((time) => (
          <option key={time.value} id={time.value}>
            {time.display}
          </option>
        ))
      }

    </select>
  )
}

export default TimeDropdown