import { useState } from "react"
import { Link } from "react-router-dom"
import { useLogin } from "../hooks/useLogin"
import './Login-Signup.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <div className="loginSignup">
      <form className="loginSignupForm" onSubmit={handleSubmit} >
        <h1>Schedge Login</h1>

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

        <button disabled={isLoading}>Login</button>
        <Link to="/signup">Need an account?</Link>

        {error && <div className="errorMsg">{error}</div>}
      </form>
    </div>
  )
}

export default Login