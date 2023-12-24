const Users = require('../models/User');
const jwt = require('jsonwebtoken');

const {genAccesToken,genRefreshToken} = require('../helpers/jwt')

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser = await Users.findOne({ where: { email }});
  console.log(foundUser);
  if (!foundUser) {
    return res.status(401).json({ message: 'Not found user' });
  }
  const matchPassword = password == foundUser.password;
  if (!matchPassword) {
    return res.status(401).json({ message: 'Wrong Pass ' });
  }
  if (foundUser.status === 'banned') {
    return res.status(401).json({ message: 'User is banned' });
  }

  const accessToken = genAccesToken(foundUser);
  const refreshToken = genRefreshToken(foundUser);

  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    SameSite: 'None',
    secure: process.env.NODE_ENV === 'production', //-only for server with https
    maxAge: 24 * 60 * 60 * 1000,
  });

  foundUser.update({ lastLogin: new Date() }).then();

  //then send access token with username and roles
  res.json({ accessToken });
};

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  const foundUser = await Users.findOne({ where: { email }});
  if (foundUser) {
    return res.status(401).json({ message: 'User already exists' });
  }

  console.log({ email, password, name })

  let createdUser = await Users.create({ email, password, name });
  const accessToken = genAccesToken(createdUser);
  const refreshToken = genRefreshToken(createdUser);

  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    SameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  console.log(createdUser);
  res.json({ accessToken });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized (no jwt)' });
  }

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden (cant verify jst)' });
      }
      const foundUser = await Users.findOne({
        where: { username: decoded.UserInfo.username }
      });
      if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized (bad jwt user)' });
      }
      const accessToken =  genAccesToken(foundUser);
      //Send accessToken with username and roles
      res.json({ accessToken });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req?.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
  res.clearCookie('jwt', { httpOnly: true, samSite: 'None', secure: true });
};

module.exports = { login, refresh, logout, register };
