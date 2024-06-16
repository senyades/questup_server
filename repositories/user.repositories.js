const db = require('../db')
const { Conflict, Unauthorized, Forbidden, NotFound } = require("../utils/errors.js");

class UserRpository
{
    static async addUser({login, password, name, surname, teacher})
    {
        const newUserQuery = await db.query('INSERT INTO users (login, password, name, surname, teacher) VALUES ($1, $2, $3, $4, $5) RETURNING *', [login, password, name, surname, teacher]);
        return newUserQuery.rows[0];
    }

    static async getUserData_by_id({ userId }) {
        try {
            const existingUserQuery = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            console.log(existingUserQuery.rows.length);
            console.log(existingUserQuery.rows[0]);
            
            if (existingUserQuery.rows.length === 0) {
                return null;
            } else {
                return existingUserQuery.rows[0];
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса к базе данных:', error);
            return null; // Возвращаем null в случае ошибки
        }
    }

    static async getUserData({ login }) {
        try {
            console.log("user.repositories login", login);
            const existingUserQuery = await db.query('SELECT * FROM users WHERE login = $1', [login]);
            console.log(existingUserQuery.rows.length);
            console.log(existingUserQuery.rows[0]);
            
            if (existingUserQuery.rows.length === 0) {
                return null;
            } else {
                return existingUserQuery.rows[0];
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса к базе данных:', error);
            throw new Conflict("Неверный формат данных")
        }
    }


}

module.exports = UserRpository;