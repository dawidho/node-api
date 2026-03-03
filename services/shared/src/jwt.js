import { SignJWT, jwtVerify } from 'jose';
const DEFAULT_SECRET = 'default-secret-change-in-production';
export class JwtService {
    secret;
    constructor(secretKey) {
        const key = secretKey || process.env.JWT_SECRET || DEFAULT_SECRET;
        this.secret = new TextEncoder().encode(key);
    }
    async generateToken(payload) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .setIssuedAt()
            .sign(this.secret);
    }
    async verifyToken(token) {
        try {
            const { payload } = await jwtVerify(token, this.secret);
            return payload;
        }
        catch (error) {
            console.error('JWT verification failed:', error);
            return null;
        }
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader)
            return null;
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        return parts[1];
    }
}
