import { Request, Response, NextFunction } from "express";
import Agreement from "@/models/Agreement";
import {
  validateAgreementEndDate,
  validateSidesOfAgreement,
} from "@/validators/agreement";
import SaleAgreement from "@/models/Agreement/SaleAgreement";
import RentAgreement from "@/models/Agreement/RentAgreement";
import { generateErrorMesaage } from "@/utils/common";
import { checkIfAgreementExists } from "@/utils/agreement";
import { checkIfPropertyExists } from "@/utils/property";

export const validateSaleAgreementBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await SaleAgreement.validate(req.body);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

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

export const validateSaleAgreementInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { buyer, seller, property } = req.body;
    const propertyDoc = await checkIfPropertyExists(property);
    res.locals = {
      property: propertyDoc,
    };
    await validateSidesOfAgreement(buyer, seller);

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
    const { property, buyer, seller } = req.body;
    const propertyDoc = await checkIfPropertyExists(property);
    res.locals = {
      property: propertyDoc,
    };
    await validateSidesOfAgreement(buyer, seller);
    next();
  } catch (e) {
    const message = generateErrorMesaage(e);
    res.status(400).send(message);
  }
};

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

export const checkSaleAgreementIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agreement = await SaleAgreement.findById(req.params.id);
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
