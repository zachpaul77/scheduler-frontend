
const MemberName = ({ member }) => {

  return (
    <span>
      <img src={member.profile_img} className="profileImgText" alt={`member ${member.name}`} /> {member.name}
    </span>
  )
}

export default MemberName