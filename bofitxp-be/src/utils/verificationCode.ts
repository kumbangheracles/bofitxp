const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getCodeExpirationTime = (minutes: number = 5) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export { generateVerificationCode, getCodeExpirationTime };
