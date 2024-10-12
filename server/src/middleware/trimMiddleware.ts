import { Request, Response, NextFunction } from 'express';

const trimMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const trimStrings = (obj: Record<string, any>) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim();
            } else if (Array.isArray(obj[key])) {
                obj[key] = obj[key].map(item =>
                    typeof item === 'string' ? item.trim() : item
                );
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                trimStrings(obj[key]);
            }
        }
    };

    trimStrings(req.body);
    trimStrings(req.query);
    trimStrings(req.params);

    next();
};

export default trimMiddleware;