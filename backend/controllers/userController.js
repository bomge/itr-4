const Users = require('../models/User');
const { Op } = require('sequelize');

const getAllUsers = async (req, res) => {
  const users = await Users.findAll({
    attributes: { exclude: ['password'] },
  });
  if (!users) {
    return res.status(400).json({ message: 'No users found' });
  }
  res.json(users);
};

const checkMe = async (req, res) => {
  const id = req.id;
  if (!id) {
    res.clearCookie('jwt', { httpOnly: true, samSite: 'None', secure: true });
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again' });
  }

  const userDB = await Users.findByPk(id);
  if (userDB.status === 'banned') {
    res.clearCookie('jwt', { httpOnly: true, samSite: 'None', secure: true });
    return res
      .status(400)
      .json({ message: `User is banned` })
      .redirect('/login');
  }

  res.json({ message: 'ok' });
};

const banUsers = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again' });
  }
  const updateUsersCount = await Users.update(
    {
      status: 'banned',
    },
    {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
  );
  res.json({ message: `Banned ${updateUsersCount[0]} success` });
};
const UnbanUsers = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again' });
  }
  const updateUsersCount = await Users.update(
    {
      status: 'active',
    },
    {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    }
  );
  res.json({ message: `Unbanned ${updateUsersCount[0]} success` });
};

const deleteUsers = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) {
    return res.status(400).json({ message: `Check your input` });
  }

  const deleteUsers = await Users.destroy({
    where: {
      id: { [Op.in]: ids },
    },
  });
  res.json({ message: `Deleted ${deleteUsers} users` });
};

module.exports = {
  banUsers,
  UnbanUsers,
  getAllUsers,
  checkMe,
  deleteUsers,
};
