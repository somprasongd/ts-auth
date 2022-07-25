import argon2 from 'argon2';

export const hash = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const verify = async (
  hash: string,
  password: string
): Promise<boolean> => {
  return argon2.verify(hash, password);
};
