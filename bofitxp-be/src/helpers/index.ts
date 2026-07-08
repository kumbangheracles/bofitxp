import { EXPIRE_TTL_MINUTE } from "../utils/env";

const helpers = () => {
  const expireTime = new Date(Date.now() + EXPIRE_TTL_MINUTE * 60 * 1000);

  return { expireTime };
};

export default helpers;
