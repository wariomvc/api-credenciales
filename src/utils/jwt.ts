import * as jwt from 'jsonwebtoken';

export const generarJWT = (uid: string) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };
    // eslint-disable-next-line no-undef
    const jwtkey = process.env.JWT_KEY ?? '';
    if (jwtkey)
      jwt.sign(
        payload,
        jwtkey,
        {
          expiresIn: '12h',
        },
        (error, token) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(token);
          }
        },
      );
  });
};
