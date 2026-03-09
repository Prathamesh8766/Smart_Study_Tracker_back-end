import jwt from 'jsonwebtoken';

const generateToken = async (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '5d'} );  // jwt.sign(payload, secret, options)
};

export default generateToken;

// The libray jwt allow as to do
//Create tokens → jwt.sign(), Verify tokens → jwt.verify(), Decode tokens → jwt.decode()

// Jwt token look like xxxxx.yyyyy.zzzzz
// Which contain : Header.Payload.Signature