const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const inventoryRpository = require('../repositories/inventory.repositories');



class InventoryService
{
    static async getInventory (userId)
    {
        return inventoryRpository.get_inventory(userId);
    }

}

module.exports = InventoryService