import { JwtService } from './jwt.js';
export class AuthMiddleware {
    jwtService;
    constructor(secretKey) {
        this.jwtService = new JwtService(secretKey);
    }
    authenticate = async (req, res, next) => {
        try {
            const token = this.jwtService.extractTokenFromHeader(req.headers.authorization);
            if (!token) {
                res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'No token provided'
                    }
                });
                return;
            }
            const payload = await this.jwtService.verifyToken(token);
            if (!payload) {
                res.status(401).json({
                    error: {
                        code: 'INVALID_TOKEN',
                        message: 'Invalid or expired token'
                    }
                });
                return;
            }
            req.user = {
                id: payload.id,
                email: payload.email,
                username: payload.username,
            };
            next();
        }
        catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Authentication failed'
                }
            });
        }
    };
    optional = async (req, res, next) => {
        try {
            const token = this.jwtService.extractTokenFromHeader(req.headers.authorization);
            if (token) {
                const payload = await this.jwtService.verifyToken(token);
                if (payload) {
                    req.user = {
                        id: payload.id,
                        email: payload.email,
                        username: payload.username,
                    };
                }
            }
            next();
        }
        catch (error) {
            // Continue without user
            next();
        }
    };
}
