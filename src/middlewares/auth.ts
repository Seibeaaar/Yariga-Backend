import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "@/models/User";
import {
  LOGIN_VALIDATION_SCHEMA,
  SIGN_UP_VALIDATION_SCHEMA,
} from "@/validators/auth";
import { generateErrorMesaage } from "@/utils/common";
import axios from "axios";

export const validatePasswordSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await SIGN_UP_VALIDATION_SCHEMA.validate(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const checkEmailInUse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingProfile = await User.findOne({
      "email.value": req.body.email,
    });
    if (existingProfile) {
      res.statusCode = 400;
      throw new Error("Email already in use");
    }
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.send(message);
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
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const validateUserCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await User.findOne({
      "email.value": req.body.email,
    });
    if (!profile) {
      res.statusCode = 400;
      throw new Error("No user found with such credentials");
    }
    if (profile?.password) {
      const passwordMatches = bcrypt.compareSync(
        req.body.password,
        profile.password,
      );
      if (!passwordMatches) {
        res.statusCode = 400;
        throw new Error("No user found with such credentials");
      }
    }
    res.locals = {
      ...res.locals,
      profile,
    };
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.send(message);
  }
};

export const verifyGoogleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.token) {
      res.statusCode = 400;
      throw new Error("Token required");
    }

    const { data: googleProfile } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.body.token}`,
    );

    if (!googleProfile) {
      res.statusCode = 403;
      throw new Error("No or invalid user detected.");
    }

    res.locals = {
      ...res.locals,
      payload: googleProfile,
    };
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.send(message);
  }
};
