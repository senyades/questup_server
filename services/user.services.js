const bcrypt = require('bcryptjs');
const db = require('../db')
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repositories')
const InventoryRepository = require('../repositories/inventory.repositories')
const TokenService = require('../services/token')
const RefreshSessionRepository = require('../repositories/RefreshSession')
const {ACCESS_TOKEN_EXPIRATION} = require("../constants.js");
const { Conflict, Unauthorized, Forbidden, NotFound } = require("../utils/errors.js");


class UserServices
{
    static async createUser({login, password, name, surname, teacher, fingerprint}) {

        
            const userData = await UserRepository.getUserData({login});
            
            if(userData != null)
            {
                throw new Conflict("Пользователь с таким именем уже существует")
            }
            // Хешируем пароль
            //const hashedPassword = await bcrypt.hash(password, 10);
            // Создаем пользователя
            const {id} = await UserRepository.addUser({ login, password, name, surname, teacher });
            // Создаем инвентарь по умолчанию
            await InventoryRepository.newInventory(id, 0, 0, 0)
            await db.query('INSERT INTO decoration (id, avatar) VALUES ($1, $2) RETURNING *', [id, 1]);
            const testData = [
                { view: false, thema: 1, blocked: false, test_id: 1 },
                { view: false, thema: 1, blocked: true, test_id: 2 },
                { view: false, thema: 1, blocked: true, test_id: 3 },
                { view: false, thema: 1, blocked: true, test_id: 4 },
                { view: false, thema: 1, blocked: true, test_id: 5 },
                { view: false, thema: 1, blocked: true, test_id: 6 }
              ];
              
              const testDataJson = JSON.stringify(testData);

              const AchiveJson = [
                { name: 'Самый богатый', got: false},
                { name: 'Начало положено', got: false},
                { name: 'Много опыта', got: false},
                { name: 'Первые баллы', got: false},
              ];
              const AchiveJsonData = JSON.stringify(AchiveJson);

              const LevelJson = [
                { name: 'Новичок', got: true},
                { name: 'Бакалавр', got: false},
                { name: 'Магистр', got: false},
                { name: 'Аспирант', got: false},
              ];
              const LevelJsonData = JSON.stringify(LevelJson);

              await db.query('INSERT INTO user_and_test (id, test_info) VALUES ($1, $2) RETURNING *', [id, testDataJson]);
              await db.query('INSERT INTO achiv_list(id, achiv_info) VALUES ($1, $2) RETURNING *', [id, AchiveJsonData]);
              await db.query('INSERT INTO level_list(id, levels_info) VALUES ($1, $2) RETURNING *', [id, LevelJsonData]);
    }
    static async loginUser({login, password, fingerprint}) {

        
        const userData = await UserRepository.getUserData({login});
        
        if(userData == null)
        {
            throw new NotFound("Такого пользователя не существует")
        }
        // Хешируем пароль
        //const isPasswordValid = bcrypt.compareSync(password, userData.password);
        if(password != userData.password)
        {
            throw new Unauthorized("Неверный логин или пароль ")
        }

        const payload = {id: userData.id, teacher: userData.teacher, login};
        const accessToken = await TokenService.generateAccessToken(payload);
        const refreshToken = await TokenService.generateRefreshToken(payload);
      
        await RefreshSessionRepository.createRefreshSession
        (
            {
                id: userData.id,
                refreshToken,
                fingerprint,
            }
        )

        console.log("refresh token in service:", refreshToken)
        console.log("access token in service:",accessToken, "and", ACCESS_TOKEN_EXPIRATION)
        return {accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION}
}
static async refresh ({fingerprint, currentRefreshToken})
{
    console.log("currentRefreshToken:", currentRefreshToken)
    
    if(!currentRefreshToken)
    {
        throw new Unauthorized();
    }
    const RefreshSession = await RefreshSessionRepository.getRefreshSession(currentRefreshToken);

    if(!RefreshSession)
    {
        console.log("Пользователь не авторизован user.service.refresh", RefreshSession)
        throw new Unauthorized();
    }

    if(RefreshSession.finger_print != fingerprint.hash)
    {
        console.log("фингер принт не похож", fingerprint.hash )
        throw new Forbidden();
    }

    await RefreshSessionRepository.deleteRefreshSession(currentRefreshToken);

    let payload
    try{
        payload = await TokenService.verifyRefreshToken(currentRefreshToken)
    }
    catch (error)
    {
        console.log("оишбка в верификации токена")
        throw new Forbidden(error);
    }

    
    const {
        id,
        teacher,
        login,
    } = await UserRepository.getUserData({login: payload.login})
    
    const actualPlayload = {id, teacher, login};

    const accessToken = await TokenService.generateAccessToken(actualPlayload);
    const refreshToken = await TokenService.generateRefreshToken(actualPlayload);

    await RefreshSessionRepository.createRefreshSession({id, refreshToken,fingerprint});

    console.log("новые токены отправлены");
    return {accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION};
        
}

    static async logOut(refreshToken)
    {
        await RefreshSessionRepository.deleteRefreshSession({refreshToken});
    }

    static async getUserData_by_id(userId) {
        console.log(userId)
        return UserRepository.getUserData_by_id({userId});
      }

      



    
}

module.exports = UserServices;