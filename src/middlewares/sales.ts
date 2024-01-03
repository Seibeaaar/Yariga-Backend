import { Request, Response, NextFunction } from "express";
import Sale from "@/models/Sale";
import { USER_ROLE } from "@/enums/user";
import {
  validateAgreementEndDate,
  validateAgreementStartDate,
  validateSidesOfSale,
} from "@/validators/sales";
import { generateErrorMesaage } from "@/utils/common";
import { checkIfSaleExists } from "@/utils/sales";
import { checkIfPropertyExists } from "@/utils/property";

/**
 * Checks request body if it includes required fields
 * Checks a validity of start and end dates of a sale
 * @throws Bad Request if an error occurs
 */
export const validateSalesBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await Sale.validate(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const validateSalesInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { endDate, startDate, type, property, buyer, seller } = req.body;
    await checkIfPropertyExists(property);
    await validateSidesOfSale(buyer, seller);
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
    const sellerRoles = [USER_ROLE.Agent, USER_ROLE.Sole];
    if (!sellerRoles.includes(profile.role)) {
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
    if (profile.role !== USER_ROLE.Customer) {
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
export const checkSaleIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sale = await checkIfSaleExists(req.params.id);
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
