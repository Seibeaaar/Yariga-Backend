import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "@/models/User";
import {
  LOGIN_VALIDATION_SCHEMA,
  SIGN_UP_VALIDATION_SCHEMA,
  POST_AUTH_VALIDATION_SCHEMA,
} from "@/validators/auth";

export const validatePasswordSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await SIGN_UP_VALIDATION_SCHEMA.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};

export const checkEmailInUse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingProfile = await User.findOne({
      email: req.body.email,
    });
    if (existingProfile) {
      res.statusCode = 400;
      next("Email already in use");
    }
    next();
  } catch (e) {
    res.send(e);
  }
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await LOGIN_VALIDATION_SCHEMA.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};

export const validateUserCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await User.findOne({ email: req.body.email });
    if (!profile) {
      res.statusCode = 400;
      next("No user found with such credentials");
    }
    if (profile?.password) {
      const passwordMatches = bcrypt.compareSync(
        req.body.password,
        profile.password,
      );
      if (!passwordMatches) {
        res.statusCode = 400;
        next("No user found with such credentials");
      }
    }
    res.locals = {
      ...res.locals,
      profile,
    };
    next();
  } catch (e) {
    res.send(e);
  }
};

export const validateProfileCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await POST_AUTH_VALIDATION_SCHEMA.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};
