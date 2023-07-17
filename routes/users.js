const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
  getActivUser,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getActivUser);
router.get('/:id', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
