const express = require('express')
const router = express.Router()
const { isLoggedIn, checkRoles, checkOwnerOrAdmin } = require('../middlewares/routes-guard')
const uploaderMiddleware = require('../middlewares/uploader.middleware')
const User = require('../models/User.model')
const { getUserRoles } = require('../utils/role-handling')


//Users lists
router.get('/', isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(user => res.render("users/user-list", { user } ))
        .catch(err => next(err))

})


//User profile
router.get('/:id', isLoggedIn, (req, res, next) => {

    const { id } = req.params

    const userRole = getUserRoles(req.session.currentUser, id)

    User
        .findById(id)
        .then(user => res.render("users/user-profile", {user, userRole}))
        .catch(err => next(err)) 
})

 

//Modify users profile
router.get('/:id/edit', isLoggedIn, checkOwnerOrAdmin, (req, res, next) => {

    const { id } = req.params

    User 
        .findById(id)
        .then(user => res.render('users/user-edit', user))
        .catch(err => next(err))
})

router.post('/:id/edit', isLoggedIn, checkOwnerOrAdmin, uploaderMiddleware.single("avatar"), (req, res, next) => {

    const { name, email, password, role, description, country } = req.body
    const { id } = req.params


    if (req.file) {
        const { path: avatar } = req.file

        User
            .findByIdAndUpdate(id, { name, email, password, role, description, avatar, country })
            .then(() => res.redirect('/'))
            .catch(err => next(err))

    }
    else {

        User
            .findByIdAndUpdate(id, { name, email, password, role, description, country })
            .then(() => res.redirect('/'))
            .catch(err => next(err))
    }
})


//Delete user
router.post('/:id/delete', isLoggedIn, checkRoles("ADMIN"), (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})

module.exports = router