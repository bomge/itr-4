const jwt = require('jsonwebtoken');

function genAccesToken(user){
    return jwt.sign(
        {
          UserInfo: {
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCCES_TOKEN_EXPIRE }
      )
}

function genRefreshToken(user){
    return jwt.sign(
        {
          UserInfo: {
            email: user.email,
            id: user._id,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
      )
}

module.exports = {
    genAccesToken,
    genRefreshToken
}