import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRY_TIME = process.env.ACCESS_TOKEN_EXPIRY_TIME as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_EXPIRY_TIME = process.env.REFRESH_TOKEN_EXPIRY_TIME as string;

const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
};

const comparePassword = async (storedPassword: string, password: string): Promise<boolean> => {
    const passwordMatch = await bcrypt.compare(password, storedPassword);
    return passwordMatch;
};

const createAccessToken = (payload: object): string => {
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
    });
    return token;
};

const createRefreshToken = (payload: object): string => {
    const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
    });
    return token;
};

const verifyRefreshToken = (token: string): JwtPayload | undefined => {
    try {
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
        return payload;
    } catch (err) {
        return undefined;
    }
};

const verifyAccessToken = (token: string): JwtPayload | undefined => {
    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
        return payload;
    } catch (err) {
        return undefined;
    }
};

export {
    hashPassword,
    comparePassword,
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
