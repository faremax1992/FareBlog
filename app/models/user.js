// Example models

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  created: {type: Date}
});

// 验证密码
UserSchema.methods.verifyPassword = function(password){
  return password === this.password;
}

mongoose.model('User', UserSchema);
