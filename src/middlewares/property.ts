import { Request, Response, NextFunction } from "express";
import Property from "@/models/Property";
import { USER_ROLE } from "@/enums/user";
import { generateErrorMesaage } from "@/utils/common";

export const validatePropertyCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Property.validate(req.body);
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const validatePropertyOwnerRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;
    if (profile.role !== USER_ROLE.Sole) {
      res.statusCode = 403;
      next("You are not allowed to operate a property");
    }
    next();
  } catch (e) {
    res.send(generateErrorMesaage(e));
  }
};
