const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  about: {
    default: 'Исследователь',
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

userSchema.methods.toJSON = function toJson() {
  const user = this.toObject();
  delete user.password;

  return user;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
