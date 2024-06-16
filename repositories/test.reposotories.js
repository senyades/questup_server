const db = require('../db')

class testRpository
{
    static async getTestList(userId) {

        console.log('Репозиторий', userId);
        const result = await db.query('SELECT test_info FROM user_and_test WHERE id = $1', [userId]);
        const testInfoArray = result.rows.map(row => row.test_info);
        console.log(testInfoArray);
        return testInfoArray;
    }
    static async updateThema(userId, testId, newThema) {
      console.log("userId", userId)
      console.log("testId", testId)
      console.log("newThema", newThema)
      try {
        // Получаем текущую информацию о тесте для пользователя
        const result = await db.query('SELECT test_info FROM user_and_test WHERE id = $1', [userId]);
        const testInfo = result.rows[0].test_info;
      
        // Изменяем thema для указанного testId
        testInfo[testId-1].thema = newThema;
      
        // Преобразуем объект testInfo в строку JSON
        const updatedTestInfo = JSON.stringify(testInfo);
      
        // Обновляем информацию о тесте для пользователя
        await db.query('UPDATE user_and_test SET test_info = $1 WHERE id = $2', [updatedTestInfo, userId]);
        
        console.log(`Thema для теста с id ${testId} пользователя с id ${userId} успешно обновлена на`);
        return { success: true };
      } catch (error) {
        console.error('Ошибка при обновлении thema:', error);
        return { success: false, error: error.message };
      }
      }
      static async getQuantityTest(userId) {

        const result = await db.query('SELECT test_info FROM user_and_test WHERE id = $1', [userId]);
        const testInfo = result.rows[0].test_info;
        let totalViewCount = 0;

        // Проходимся по каждому объекту в массиве
        testInfo.forEach(testInfo => {
          console.log('view ',testInfo.test_id,' ', testInfo.view)
            if (testInfo.view == true) {
                // Если существует, увеличиваем общее количество просмотров на значение view текущего объекта
                totalViewCount += testInfo.view;
            }
        }) 
        
        console.log(totalViewCount);
        return totalViewCount;
    }

    static async updateBlockedStatus(testId, isBlocked) {
      try {
        console.log(testId, isBlocked)
        // SQL-запрос для обновления состояния blocked
        const result = await db.query(`
        UPDATE user_and_test
        SET test_info = (
          SELECT jsonb_agg(
            CASE 
              WHEN (element->>'test_id')::int = $1 THEN
                jsonb_set(element, '{blocked}', to_jsonb($2::boolean))
              ELSE
                element
            END
          )
          FROM jsonb_array_elements(test_info) AS element
        )
        WHERE test_info @> $3::jsonb;
      `, [testId, isBlocked, `[{ "test_id": ${testId} }]`]);
        // Возвращаем результат выполнения запроса
        console.log(result)
        return result;
      } catch (error) {
        // Обработка ошибок
        console.error('Error updating blocked status:', error);
        throw error;
      }
    }
    
    
    
   
}

module.exports = testRpository;