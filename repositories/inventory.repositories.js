
const db = require('../db')

class inventoryRpository
{
    static async newInventory(id, diamonds, exp, score)
    {
        const defaultInventoryQuery = await db.query('INSERT INTO inventory (id, diamonds, exp, score) VALUES ($1, $2, $3, $4) RETURNING *', [id, diamonds, exp, score]);
        
        return defaultInventoryQuery.rows[0];
    }

    static async get_inventory(id) {
        try {
            // Выполняем SQL-запрос для получения инвентаря пользователя по его id
            const inventoryQuery = await db.query('SELECT * FROM inventory WHERE id = $1', [id]);
            
            // Если инвентарь пользователя найден, возвращаем его
            if (inventoryQuery.rows.length > 0) {
                return inventoryQuery.rows[0];
            } else {
                // Если инвентарь пользователя не найден, возвращаем пустой объект или null
                return {}; // или return null;
            }
        } catch (error) {
            // Если произошла ошибка при выполнении запроса, возвращаем null или выбрасываем ошибку
            console.error("Ошибка при получении инвентаря пользователя:", error);
            return null;
            // или throw error;
        }
    }
}

module.exports = inventoryRpository;