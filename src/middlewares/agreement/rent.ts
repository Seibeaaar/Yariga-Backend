import { Request, Response, NextFunction } from "express";
import {
  validateAgreementEndDate,
  validateSidesOfAgreement,
} from "@/validators/agreement";
import RentAgreement from "@/models/Agreement/RentAgreement";
import { generateErrorMesaage } from "@/utils/common";
import { checkIfPropertyExists } from "@/utils/property";

export const validateRentAgreementBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await RentAgreement.validate(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const validateRentAgreementInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buyer, seller, property, endDate, startDate } = req.body;
    const propertyDoc = await checkIfPropertyExists(property);
    res.locals = {
      property: propertyDoc,
    };
    await validateSidesOfAgreement(buyer, seller);
    await validateAgreementEndDate(startDate, endDate);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

export const checkRentAgreementIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agreement = await RentAgreement.findById(req.params.id);
    res.locals = {
      ...res.locals,
      agreement,
    };
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};
