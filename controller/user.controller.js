const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repositories')
const UserServices = require('../services/user.services')
const {COOKIE_SETTINGS} = require("../constants.js");
const ErrorsUtils = require("../utils/errors.js");
const InventorySrvice = require("../services/inventory.service.js");
const inventoryService = require('../services/inventory.service.js');

class UserController
{
    async createUser(req, res) {
        const { login, password, name, surname, teacher } = req.body;
        const {fingerprint} = req;
        try {
            await UserServices.createUser({login, password, name, surname, teacher, fingerprint});
            return res.status(200).json({login, name});

        } catch (err) {
            return ErrorsUtils.ErrorUtils.catchError(res, err);
        }
    }
    async getUsers (req, res)
    {
        try {
            // Выполнить запрос, объединяя таблицы users и inventory по id
            const query = `
                SELECT users.id, users.name, users.surname, users.login, users.password, users.teacher, inventory.diamonds, inventory.exp, inventory.score
                FROM users
                JOIN inventory ON users.id = inventory.id
            `;
            const result = await db.query(query);
            const userData = result.rows;
    
            // Отправить данные о пользователях в ответе
            res.json(userData);
        } catch (error) {
            // Обработка ошибок
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }
    async loginUser(req, res) {

            const { login, password } = req.body;
            console.log(login, password);
            const {fingerprint} = req;
        try {
            const {accessToken, refreshToken, accessTokenExpiration} =
            await UserServices.loginUser({login, password, fingerprint});
            res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
            return res.status(200).json({accessToken, accessTokenExpiration});
        } catch (err) {
            return ErrorsUtils.ErrorUtils.catchError(res, err);
        }
    }
    async deleteUser (req, res)
    {
        const {userId} = req.body; // Получаем id пользователя из запроса
        console.log(userId)
    try {
        // Удаляем пользователя из таблицы users
        
        
        // Удаляем записи о пользователе из других связанных таблиц
        await db.query('DELETE FROM refresh_sessions WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM inventory WHERE id = $1', [userId]);
        await db.query('DELETE FROM decoration WHERE id = $1', [userId]);
        await db.query('DELETE FROM user_and_test WHERE id = $1', [userId]);
        await db.query('DELETE FROM level_list WHERE id = $1', [userId]);
        await db.query('DELETE FROM achiv_list WHERE id = $1', [userId]);
        await db.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'Пользователь успешно удален и связанные записи тоже удалены' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении пользователя' });
    }
    }

    async refresh(req, res)
    {
        const {fingerprint} = req;
        const currentRefreshToken = req.cookies.refreshToken;
        console.log(fingerprint)
        console.log("refresh token in cookies:", currentRefreshToken )
        try{
            const{accessToken, refreshToken, accessTokenExpiration} = 
            await UserServices.refresh(
                {
                    fingerprint,
                    currentRefreshToken
                });
                res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);
                return res.status(200).json({accessToken, accessTokenExpiration});
        }
        catch(err)
        {
            return ErrorsUtils.ErrorUtils.catchError(res, err);
        }
    }

    async logOut(req, res)
    {
        const refreshToken = req.cookies.refreshToken;
        const {fingerprint} = req;

        try{
            console.log("Выход")
            await UserServices.logOut(refreshToken);
            res.clearCookie("refreshToken")
            return res.sendStatus(200);
        }
        catch(err)
        {
            return ErrorsUtils.catchError(res, err);
        }
    }

    async getUserData(req, res) {
        try {
          // Получаем access token из заголовка запроса
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору
          console.log(userId)
          const userData = await UserServices.getUserData_by_id(userId);
          const inventoryData = await inventoryService.getInventory(userId);
          
          const combinedData = {
            user: userData,
            inventory: inventoryData
        };

        // Отправляем объединенные данные клиенту
        res.json(combinedData);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }


      async getLeaderboard(req, res) {
        try {
            // Выполнить запрос к таблице users и объединить с таблицей inventory и decoration
            const query = `
                SELECT users.name, users.surname, decoration.avatar, inventory.diamonds, inventory.exp,
                       (inventory.diamonds + inventory.exp) AS total_score
                FROM users 
                JOIN inventory ON users.id = inventory.id 
                JOIN decoration ON users.id = decoration.id
                WHERE users.teacher = false 
                ORDER BY total_score DESC
            `;
            const result = await db.query(query);
            const leaderboard = result.rows.map((user, index) => ({
                position: index + 1,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar, // Добавлено поле avatar
                diamonds: user.diamonds,
                exp: user.exp,
                totalScore: user.total_score
            }));
            
            // Отправить список пользователей в ответе
            res.json(leaderboard);
        } catch (error) {
            // Обработка ошибок
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    
    
     
}



module.exports = new UserController()