import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import './Navbar.css'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h2>Home</h2>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">
                <span className='navbarEntry'>Login</span>
              </Link>
              <Link to="/signup">
                <span className='navbarEntry'>Signup</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar