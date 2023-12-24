import { Request, Response, NextFunction } from "express";
import CommonProfile from "@/models/CommonProfile";

export const validatePasswordSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await CommonProfile.validate(req.body);
    if (!req.body.password) {
      next("Password is required");
    }
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};
