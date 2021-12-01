const jwt = require('jsonwebtoken');
const SECRET = "secret";

const createToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    SECRET,
    {
      expiresIn: '1h'
    }
  );
  return token; 
}

module.exports = createToken;
