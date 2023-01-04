const { Link } = ReactRouterDOM

import { BugEdit } from "./bug-edit.jsx"
import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <div className="hidden-container">
                    <button className="hidden-btn" onClick={() => { onRemoveBug(bug._id) }}>x</button>
                    <button className="hidden-btn" onClick={() => { onEditBug(bug) }}>Edit</button>
                    {/* <Link to={`/bug/${bug._id}`}>Edit</Link> */}
                </div>
                <Link to={`/bug/${bug._id}`}>Details</Link>
            </li>)}
    </ul>
}
