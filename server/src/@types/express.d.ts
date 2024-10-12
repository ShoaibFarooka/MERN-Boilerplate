import * as express from 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            name: string;
            role: string;
        }

        interface Request {
            user?: User; // Adding the user property to the Request interface
        }
    }
}
