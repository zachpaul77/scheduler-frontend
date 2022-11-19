import { useState } from "react"
import { Link } from "react-router-dom"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div className="loginSignup">
      <form className="loginSignupForm" onSubmit={handleSubmit}>
        <h1>Schedge Signup</h1>

        <input 
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          required="true"
          placeholder="Email address"
        />
        <input 
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          required="true"
          placeholder="Password"
        />

        <button disabled={isLoading}>Signup</button>
        <Link to="/login">Already have an account?</Link>

        {error && <div className="errorMsg">{error}</div>}
      </form>
    </div>
  )
}

export default Signup