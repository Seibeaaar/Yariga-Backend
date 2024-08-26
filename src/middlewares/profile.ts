import { Request, Response, NextFunction } from "express";
import { validateSellerInformation } from "@/validators/profile";
import { POST_AUTH_VALIDATION_SCHEMA } from "@/validators/profile";
import { generateErrorMesaage } from "@/utils/common";
import { USER_ROLE } from "@/enums/user";

export const validateProfileCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await POST_AUTH_VALIDATION_SCHEMA.validate(req.body);
    await validateSellerInformation(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

/**
 * Checks whether a profile is a client
 * @throws Forbidden when not a client
 */
export const checkIfClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;
    if (profile.role !== USER_ROLE.Tenant) {
      throw new Error("You are not allowed to perform this operation");
    }
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(403).send(message);
  }
};

/**
 * Checks whether a profile is a landlord
 * @throws Forbidden when not a landlord
 */
export const checkIfLandlord = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;
    if (profile.role !== USER_ROLE.Landlord) {
      throw new Error("You are not allowed to perform this operation");
    }
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(403).send(message);
  }
};
