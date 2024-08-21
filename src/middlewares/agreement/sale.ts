import { Request, Response, NextFunction } from "express";
import SaleAgreement from "@/models/Agreement/SaleAgreement";
import { validateSidesOfAgreement } from "@/validators/agreement";
import { checkIfPropertyExists } from "@/utils/property";
import { generateErrorMesaage } from "@/utils/common";

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
