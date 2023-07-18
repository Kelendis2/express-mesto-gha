const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
