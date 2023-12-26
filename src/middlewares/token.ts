import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { omit } from "lodash";
import User from "@/models/User";

export const verifyJWToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      res.statusCode = 401;
      next("No authorization header provided");
    }
    const token = authorization?.split(" ")[1];
    if (!token) {
      res.statusCode = 401;
      next("No token provided");
    }
    jwt.verify(token!, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.statusCode = 403;
        next("Invalid JWT token");
      } else {
        res.locals = {
          ...res.locals,
          token: decoded,
        };
        next();
      }
    });
  } catch (e) {
    res.send(e);
  }
};

export const extractProfileFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = res.locals;
    if (!token || !token.data) {
      res.statusCode = 401;
      next("No token provided");
    }
    const profile = await User.findById(token.data);
    if (!profile) {
      res.statusCode = 400;
      next(`No profile with ID ${token.data} found`);
    }
    res.locals = {
      ...res.locals,
      profile: omit(profile!.toObject(), "password"),
    };
    next();
  } catch (e) {
    res.send(e);
  }
};
