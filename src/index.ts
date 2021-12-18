import { JsonWebTokenError, JwtPayload, sign, TokenExpiredError, verify as ver, VerifyErrors } from 'jsonwebtoken';

export type Payload = JwtPayload | undefined;
export interface Token {
  secret: string;
  expires: number;
}
export function generate(payload: any, secret: string, expiresIn: number): Promise<string | undefined> {
  return new Promise<string | undefined>(((resolve, reject) => {
    sign(payload, secret, { expiresIn }, (err, token?: string) => err ? reject(err) : resolve(token));
  }));
}
export function verify(token: string, secret: string): Promise<Payload> {
  return new Promise<Payload>(((resolve, reject) => {
    ver(token, secret, (err: VerifyErrors | null, payload: Payload) => err ? reject(err) : resolve(payload));
  }));
}
export class TokenService {
  constructor() {
    this.generate = this.generate.bind(this);
    this.verify = this.verify.bind(this);
  }
  generate(payload: any, secret: string, expiresIn: number): Promise<string | undefined> {
    return generate(payload, secret, expiresIn);
  }
  verify(token: string, secret: string): Promise<Payload> {
    return verify(token, secret);
  }
}
export function buildJwtError(err: any): { status: number, body: string } {
  if (err instanceof TokenExpiredError) {
    return { status: 401, body: 'the token is expired' };
  } else if (err instanceof JsonWebTokenError) {
    return { status: 401, body: 'invalid token' };
  } else {
    return { status: 500, body: 'Internal Server Error ' + toString(err) };
  }
}
export function toString(err: any): string {
  return (typeof err === 'string' ? err : JSON.stringify(err));
}
