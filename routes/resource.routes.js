const Router = require('express')
const router = new Router()
const UserController = require('../controller/user.controller')
const jwt = require('jsonwebtoken');
const TokenService = require('../services/token');

const InventoryController = require('../controller/inventory.controller')

const testController = require('../controller/test.controller');
const inventoryController = require('../controller/inventory.controller');


router.get('/get_user_data', TokenService.checkAccess, UserController.getUserData)
router.post("/delete_user",TokenService.checkAccess, UserController.deleteUser);

router.get('/get_test_list', TokenService.checkAccess, testController.getTestList)
router.post('/update_thema', TokenService.checkAccess, testController.updatedTheme)
router.post('/update_blocked', TokenService.checkAccess, testController.updateBlockedStatus)

router.get('/quantity_test', TokenService.checkAccess, testController.QuantityTest)
router.get('/get_users',TokenService.checkAccess, UserController.getUsers)

router.post('/diamonds_update', TokenService.checkAccess, InventoryController.updateInventory_diamonds)
router.post('/exp_update', TokenService.checkAccess, InventoryController.updateInventory_exp)
router.post('/score_update', TokenService.checkAccess, InventoryController.updateInventory_score)

router.get('/avatar_id', TokenService.checkAccess, inventoryController.GetAvatarId)
router.post('/avatar_id_update', TokenService.checkAccess, inventoryController.UpdateAvatarId)


router.get('/achive_list', TokenService.checkAccess, testController.getAchivList)
router.get('/level_list', TokenService.checkAccess, testController.getLevelList)
router.post('/achiv_update', TokenService.checkAccess, testController.updateAchiv)

module.exports = router