import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const PEPPER = process.env.PEPPER;

if (!PEPPER) {
  throw new Error('PEPPER no esta definido en las variables de entorno');
}

export const hashearPassword = async (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password inválida');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password + PEPPER, salt);
  return hashedPassword;
};

export const verificarPassword = async (password, hashedPassword) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password inválida');
  }
  return await bcrypt.compare(password + PEPPER, hashedPassword);
};