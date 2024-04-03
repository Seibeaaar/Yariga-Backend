import { Request, Response, NextFunction } from "express";
import Agreement from "@/models/Agreement";
import { USER_ROLE } from "@/enums/user";
import {
  validateAgreementEndDate,
  validateAgreementStartDate,
  validateSidesOfAgreement,
} from "@/validators/agreement";
import { generateErrorMesaage } from "@/utils/common";
import { checkIfAgreementExists } from "@/utils/agreement";
import { checkIfPropertyExists } from "@/utils/property";

/**
 * Checks request body if it includes required fields
 * Checks a validity of start and end dates of a sale
 * @throws Bad Request if an error occurs
 */
export const validateAgreementBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Agreement.validate(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const validateAgreementInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { endDate, startDate, type, property, buyer, seller } = req.body;
    await checkIfPropertyExists(property);
    await validateSidesOfAgreement(buyer, seller);
    validateAgreementStartDate(startDate);
    validateAgreementEndDate(startDate, type, endDate);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

/**
 * Checks whether a profile is a seller
 * @throws Forbidden when not a seller
 */
export const checkIfSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profile } = res.locals;
    if (profile.role !== USER_ROLE.Sole) {
      throw new Error("You are not allowed to perform this operation");
    }
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(403).send(message);
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
    if (profile.role !== USER_ROLE.Client) {
      throw new Error("You are not allowed to perform this operation");
    }
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(403).send(message);
  }
};

/**
 * Checks if ID is passed as a req param
 * Checks if a sale with the id exists and passes it in locals
 * @throws Bad Request in case of error
 */
export const checkAgreementIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sale = await checkIfAgreementExists(req.params.id);
    res.locals = {
      ...res.locals,
      sale,
    };
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};
