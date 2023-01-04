const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { BugList } from "./bug-list.jsx"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()

    useEffect(() => {
        userService.get(userId)
            .then(user => {
                setUser(user)
            })
            .catch(err => {
                showErrorMsg('Cannot load user')
            })
    }, [])

    if (!user) return <h1>loadings....</h1>
    return user && <div className="profile-container">
        <div className="profile-image-container">
            <img src="./assets/img/default-user.png" alt="" />
        </div>
        <h2>{user.fullname}</h2>
        <h5>Username: {user.username}</h5>

    </div>
}