const { NavLink, Link } = ReactRouterDOM
const { useState } = React

import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'
import { UserDetails } from './user-details.jsx'
import { UserMsg } from './user-msg.jsx'

export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggedinUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }
    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    return <header>

        {/* <UserMsg /> */}
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
        {/* <h1>Bugs are Forever</h1> */}

        <div className="user-container">
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <button onClick={onLogout}>Logout</button>
                    <Link to={`/user/${user._id}`}>Profile</Link>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
        </div>
    </header >
}
