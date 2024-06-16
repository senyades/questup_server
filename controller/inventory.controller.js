const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


class InventoryController
{
    
    async updateInventory_diamonds(req, res) {
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id;
         // Получаем идентификатор пользователя из JWT токена
        const { diamonds } = req.body;

        const DiamondsFromDB = await db.query('SELECT diamonds FROM inventory WHERE id = $1', [userId]);

        console.log(DiamondsFromDB.rows[0].diamonds)
        const diamonds2 = DiamondsFromDB.rows[0].diamonds + diamonds;

        try {
            await db.query('UPDATE inventory SET diamonds = $1  WHERE id = $2', [diamonds2, userId]);
            res.json({ message: "Inventory updated successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateInventory_exp(req, res) {
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id;
         // Получаем идентификатор пользователя из JWT токена
        const { exp } = req.body;

        const ExpFromDB = await db.query('SELECT exp FROM inventory WHERE id = $1', [userId]);
        console.log(ExpFromDB.rows[0].exp)
        const exp2 = ExpFromDB.rows[0].exp + exp;

        try {
            await db.query('UPDATE inventory SET exp = $1  WHERE id = $2', [exp2, userId]);
            res.json({ message: "Inventory updated successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateInventory_score(req, res) {
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id;
        console.log(userId)
        const { score } = req.body;

        const ExpFromDB = await db.query('SELECT score FROM inventory WHERE id = $1', [userId]);
        console.log(ExpFromDB.rows[0].score)
        const score2 = ExpFromDB.rows[0].score + score;
         // Получаем идентификатор пользователя из JWT токена
       
        console.log(score2)
        try {
            await db.query('UPDATE inventory SET score = $1  WHERE id = $2', [score2, userId]);
            res.json({ message: "Inventory updated successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    

    async GetAvatarId(req, res)
    {
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id;
         // Получаем идентификатор пользователя из JWT токена
        try {
            const ExpFromDB = await db.query('SELECT avatar FROM decoration WHERE id = $1', [userId]);
            res.json(ExpFromDB.rows[0]);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async UpdateAvatarId(req, res)
    {
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id;
        
        const { avatarId } = req.body;
        console.log(avatarId)
         // Получаем идентификатор пользователя из JWT токена
        try {
            const ExpFromDB = await db.query('UPDATE decoration SET avatar = $1  WHERE id = $2', [avatarId, userId]);
            res.json(ExpFromDB.rows[0]);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new InventoryController()