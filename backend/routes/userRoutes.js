const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')





router.use(verifyJWT)
router
  .route('/')
  .get(userController.getAllUsers)
router.route('/ban').post(userController.banUsers)
router.route('/unban').post(userController.UnbanUsers)
router.route('/delete').post(userController.deleteUsers)
router.route('/getAll').get(userController.getAllUsers)
router.route('/checkMe').post(userController.checkMe)

module.exports = router
