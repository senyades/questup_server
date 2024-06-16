const db = require('../db')
const jwt = require('jsonwebtoken');

const testRpository = require('../repositories/test.reposotories');



class TestService
{
    static async getTestList (UserId)
    {
       return testRpository.getTestList(UserId);
    }

    static async updateThema(userId, testId, newThema)
    {
        return testRpository.updateThema(userId, testId, newThema)
    }

    static async getQuantityTest(userId)
    {
        return testRpository.getQuantityTest(userId)
    }

    static async updateBlockedStatus(testId, isBlocked)
    {
        return testRpository.updateBlockedStatus(testId, isBlocked)
    }

}

module.exports = TestService