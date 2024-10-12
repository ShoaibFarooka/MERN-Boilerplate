import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    code?: string | number;
}

const errorHandlerMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const code = error.code !== undefined ? Number(error.code) : undefined;

    if (typeof code === 'number' && !isNaN(code) && error.message) {
        res.status(code).json({ error: error.message });
        return;
    } else {
        console.error('Error: ', error); // Use console.error for error logging
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
};

export default errorHandlerMiddleware;
