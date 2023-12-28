import { Request, Response, NextFunction } from "express";
import Property from "@/models/Property";
import { USER_ROLE } from "@/enums/user";

export const validatePropertyCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Property.validate(req.body);
    next();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

export const validatePropertyOwnerRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;
    if (![USER_ROLE.Sole, USER_ROLE.GM].includes(profile.role)) {
      next("You are not allowed to operate a property");
    }
    next();
  } catch (e) {
    res.status(403).send(e);
  }
};
