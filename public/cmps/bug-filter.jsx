const { useState, useEffect, useRef } = React

import { bugService } from "../services/bug.service.js"
import { Pagination } from "./pagination.jsx"


export function BugFilter({ onSetFilter, onSetSort, maxPages }) {

    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())
    const elInputRef = useRef(null)
    const [sortByToEdit, setSortByToEdit] = useState(bugService.getDefaultSort())

    useEffect(() => {
        elInputRef.current.focus()
    }, [])

    useEffect(() => {
        onSetFilter(filterByToEdit)
        onSetSort(sortByToEdit)
    }, [filterByToEdit, sortByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        value = type === 'checkbox' ? (target.checked ? -1 : 1) : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handlePageChange(number) {
        if (
            filterByToEdit.pageIdx + number < 0 ||
            filterByToEdit.pageIdx + number > maxPages - 1
        )
            return
        setFilterByToEdit((prevFilter) => ({
            ...prevFilter,
            pageIdx: prevFilter.pageIdx + number,
        }))
    }

    function handleSortChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'checkbox' ? (target.checked ? -1 : 1) : value
        setSortByToEdit((prevSort) => ({ ...prevSort, [field]: value }))
    }


    return <section className="bug-filter">
        <form onSubmit={onSubmitFilter}>
            <label htmlFor="title">Title:</label>
            <input type="text"
                id="title"
                name="title"
                placeholder="By title"
                value={filterByToEdit.title}
                onChange={handleChange}
                ref={elInputRef}
            />

            <label htmlFor="minSeverity">Min severity:</label>
            <input type="number"
                id="minSeverity"
                name="minSeverity"
                placeholder="By min severity"
                value={filterByToEdit.minSeverity}
                onChange={handleChange}
            />

            <label htmlFor='desc'>Descending:</label>
            <input
                name='desc'
                id='desc'
                type='checkbox'
                value={sortByToEdit.desc}
                onChange={handleSortChange}
            />

            {/* <button>Filter bugs</button> */}
        </form>

        <select
            name='sortByCat'
            value={sortByToEdit.sortByCat}
            onChange={handleSortChange}>
            <option value=''>Select Sorting</option>
            <option value='title'>Title</option>
            <option value='severity'>Severity</option>
            <option value='createdAt'>CreatedAt</option>
        </select>

        <Pagination
            currentPage={filterByToEdit.pageIdx}
            handlePageChange={handlePageChange}
        />

    </section>
}