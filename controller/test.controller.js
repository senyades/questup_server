const db = require('../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const TestService = require('../services/test.service')

class testController
{
    async getTestList(req, res) {
        try {
          // Получаем access token из заголовка запроса
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору
          console.log(userId)
          const userTestList = await TestService.getTestList(userId)

        // Отправляем объединенные данные клиенту
        res.json(userTestList);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }  

      async updatedTheme(req, res) {
        const {testId, newThema } = req.body; // Предполагается, что данные приходят в теле запроса
        const accessToken = req.headers.authorization.split(' ')[1];
        // Расшифровываем токен, чтобы получить информацию о пользователе
        const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
        const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
        console.log("userId в controller", userId)
        try {
          // Вызываем метод репозитория для обновления thema
          const result = await TestService.updateThema(userId, testId, newThema);
      
          // Проверяем результат обновления
          if (result.success) {
            res.status(200).json({ message: `Thema для теста с id ${testId} пользователя с id ${userId} успешно обновлена на ${newThema}`} );
          } else {
            res.status(500).json({ error: 'Ошибка при обновлении thema', details: result.error });
          }
        } catch (error) {
          console.error('Ошибка при обновлении thema:', error);
          res.status(500).json({ error: 'Ошибка при обновлении thema', details: error.message });
        }
      }
      
      async QuantityTest(req, res)
      {
        try {
          // Получаем access token из заголовка запроса
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору
          console.log(userId)
          const userTestList = await TestService.getQuantityTest(userId)

        // Отправляем объединенные данные клиенту
        res.json(userTestList);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }

      async updateBlockedStatus(req, res)
      {
        try {
          // Получаем access token из заголовка запроса
          const {testId, isBlocked} = req.body; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору
          console.log(testId)
          console.log(isBlocked)
          await TestService.updateBlockedStatus(testId, isBlocked)

        // Отправляем объединенные данные клиенту
        res.status(200).json({ message: 'Данные обновлены для теста' });
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }

      }


      async getLevelList(req, res) {
        try {
          // Получаем access token из заголовка запроса
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору
          console.log(userId)

          const result = await db.query('SELECT level_info FROM level_list WHERE id = $1', [userId]);
          const LevelInfoArray = result.rows.map(row => row.level_info);
          console.log(LevelInfoArray);
         

        // Отправляем объединенные данные клиенту
        res.json(LevelInfoArray);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }  

      async getAchivList(req, res) {
        try {
          // Получаем access token из заголовка запроса
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору

          const result = await db.query('SELECT achiv_info FROM achiv_list WHERE id = $1', [userId]);
          const AchivInfoArray = result.rows.map(row => row.achiv_info);
          console.log(AchivInfoArray);

        // Отправляем объединенные данные клиенту
        res.json(AchivInfoArray);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }  

      async updateAchiv(req, res) {
        try {
          // Получаем access token из заголовка запроса
          const {achivId, newGot} = req.body; 
          const accessToken = req.headers.authorization.split(' ')[1];
          // Расшифровываем токен, чтобы получить информацию о пользователе
          const decodedToken = jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET);
          const userId = decodedToken.id; // Предположим, что идентификатор пользователя хранится в полезной нагрузке токена
          // Получаем данные о пользователе по его идентификатору

          const result = await db.query('SELECT achiv_info FROM achiv_list WHERE id = $1', [userId]);
          const achivInfo = result.rows[0].achiv_info;
          console.log(achivInfo)

          console.log(newGot)
        
          console.log(achivId)
          // Изменяем thema для указанного testId
          achivInfo[achivId-1].got = newGot;
        
          // Преобразуем объект testInfo в строку JSON
          const updatedAchivInfo = JSON.stringify(achivInfo);
        
          // Обновляем информацию о тесте для пользователя
          await db.query('UPDATE achiv_list SET achiv_info = $1 WHERE id = $2', [updatedAchivInfo, userId]);
        
        // Отправляем объединенные данные клиенту
        res.status(200);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }  


}

module.exports = new testController()