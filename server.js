const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()
const PORT = 3030

const COOKIE_AGE = 1000 * 15
const IS_PREMIUM = false

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there!'))

//List
app.get('/api/bug', (req, res) => {
    console.log('req.query:', req.query)
    const { title, labels, minSeverity, pageIdx, pageSize, sortByCat, desc } = req.query
    const sortBy = {
        sortByCat, desc
    }
    const filterBy = {
        title, labels, minSeverity, pageIdx, pageSize
    }
    bugService.query(filterBy, sortBy)
        .then((bugs) => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get bugs')
        })

})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bug = req.body

    console.log('CAR ---------', bug)
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update bug')
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bug = req.body

    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

//Read - GetById
app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params
    const { currBugId } = req.cookies
    let visitCountIds = req.cookies.visitCountIds || []
    if (!visitCountIds.includes(bugId)) {
        if (visitCountIds.length >= 3 && !IS_PREMIUM) {
            return res.status(401).send('Wait for a bit')
        }
        visitCountIds.push(bugId)
    }


    bugService.get(bugId)
        .then(bug => {
            res.cookie('visitCountIds', visitCountIds, { maxAge: COOKIE_AGE })
            res.send(bug)
        })
        .catch(err => {
            res.status(418).send(err.message)
        })

})

//Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')
    // if (!loggedinUser.isAdmin) return res.status(401).send('Cannot update bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send({ msg: 'Bug removed successfully', bugId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete bug')
        })
})

// User API:
// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})


app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


app.listen(PORT, () => console.log('Server ready at port', PORT))