
const MemberName = ({ member }) => {

  return (
    <span>
      <img src={member.profile_img} className="profileImgText" /> {member.name}
    </span>
  )
}

export default MemberName