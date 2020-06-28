import {sign, TokenExpiredError, verify} from 'jsonwebtoken';

export interface TokenService {
  generateToken(payload: any, secret: string, expiresIn: number): Promise<string>;
  verifyToken(token: string, secret: string): Promise<any>;
}

export class jwt {
  static generateToken(payload: any, secret: string, expiresIn: number): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      sign(payload, secret, {expiresIn}, (err, token: string) => err ? reject(err) : resolve(token));
    }));
  }

  static verifyToken(token: string, secret: string): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      verify(token, secret, (err, payload: any) => err ? reject(err) : resolve(payload));
    }));
  }
}

export class DefaultTokenService implements TokenService {
  generateToken(payload: any, secret: string, expiresIn: number): Promise<string> {
    return jwt.generateToken(payload, secret, expiresIn);
  }

  verifyToken(token: string, secret: string): Promise<any> {
    return jwt.verifyToken(token, secret).then(v => v).catch(err => {
      if (err instanceof TokenExpiredError) {
        err['errorType'] = 'TokenExpired';
      }
      throw err;
    });
  }
}
