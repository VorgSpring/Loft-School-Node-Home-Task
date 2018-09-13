const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  middleName: {
    type: String,
    default: ''
  },
  surName: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  permission: {
    chat: {
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: false
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    },
    news: {
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: false
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    },
    setting: {
      C: {
        type: Boolean,
        default: false
      },
      R: {
        type: Boolean,
        default: false
      },
      U: {
        type: Boolean,
        default: false
      },
      D: {
        type: Boolean,
        default: false
      }
    }
  }
});

mongoose.model('user', UserSchema);