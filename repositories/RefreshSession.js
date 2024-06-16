const db = require('../db')

class RefreshSessionRepository {
  static async getRefreshSession(refreshToken) {
    const response = await db.query("SELECT * FROM refresh_sessions where refresh_token=$1", [refreshToken]);
    console.log("сессия в бд:", response.rows[0])
    if(response.rows.length==0)
    {
      return null;
    }
    return response.rows[0];
  }

  static async createRefreshSession({id, refreshToken, fingerprint}) {
    console.log("id:", id, "refreshToken:",refreshToken, "fingerprint:",fingerprint)
    await db.query("INSERT INTO refresh_sessions (user_id, refresh_token, finger_print) VALUES ($1, $2, $3)", [id, refreshToken, fingerprint.hash]);
  }

  static async deleteRefreshSession({refreshToken}) {
    await db.query("DELETE FROM refresh_sessions WHERE refresh_token=$1", [refreshToken])
  }
}
module.exports = RefreshSessionRepository;