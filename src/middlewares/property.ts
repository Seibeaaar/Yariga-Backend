import { Request, Response, NextFunction } from "express";
import { USER_ROLE } from "@/enums/user";
import { generateErrorMesaage } from "@/utils/common";
import { PROPERTY_VALIDATION_SCHEMA } from "@/validators/property";
import { checkIfPropertyExists } from "@/utils/property";

export const validatePropertyData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PROPERTY_VALIDATION_SCHEMA.validate(req.body);
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

export const validatePropertyIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const property = await checkIfPropertyExists(req.params.id);
    res.locals = {
      ...res.locals,
      property,
    };
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkiIfPropertyOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile, property } = res.locals;
    if (property.owner !== profile.id) {
      throw new Error("You do not own this property");
    }
    next();
  } catch (e) {
    res.status(403).send(generateErrorMesaage(e));
  }
};
