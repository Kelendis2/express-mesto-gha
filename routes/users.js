const router = require('express').Router();

const auth = require('../.github/middlewares/auth');
const {
  createUser,
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
  login,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);
router.use(auth);
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateAvatar);



module.exports = router;
