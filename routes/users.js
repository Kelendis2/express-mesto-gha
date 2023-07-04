const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
