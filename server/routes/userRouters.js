const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/')
    // get = read in CRUD
    .get(usersController.getAllUsers)
    // post = create in CRUD
    .post(usersController.createNewUser)
    // patch = update in CRUD
    .patch(usersController.updateUser)
    // delete = delete in CRUD
    .delete(usersController.deleteUser);

module.exports = router;