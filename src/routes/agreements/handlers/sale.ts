import { Request, Response, NextFunction } from "express";

import { AGREEMENT_STATUS } from "@/enums/agreement";
import { PROPERTY_STATUS } from "@/enums/property";
import SaleAgreement from "@/models/Agreement/SaleAgreement";
import { generateErrorMesaage } from "@/utils/common";

import { changePropertyStatus } from "@/utils/property";

export const handleSaleAgreementCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agreement = new SaleAgreement({
      ...req.body,
      status: AGREEMENT_STATUS.Pending,
    });
    await agreement.save();
    res.status(201).send(agreement);
    res.locals.agreement = agreement;
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleSaleAgreementUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { agreement } = res.locals;
    const updatedAgreement = await SaleAgreement.findByIdAndUpdate(
      agreement.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).send(updatedAgreement);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleSaleAgreementAccept = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { agreement } = res.locals;

    const updatedAgreement = await SaleAgreement.findByIdAndUpdate(
      agreement.id,
      {
        status: AGREEMENT_STATUS.Settled,
      },
      {
        new: true,
      },
    );

    const updatedProperty = await changePropertyStatus(
      agreement.property,
      PROPERTY_STATUS.Reserved,
    );

    res.locals.property = updatedProperty;

    res.status(200).send({
      agreement: updatedAgreement,
      property: updatedProperty,
    });

    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleSaleAgreementDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    await SaleAgreement.findByIdAndDelete(id);

    await changePropertyStatus(property, PROPERTY_STATUS.Free);
    res.status(200).send(`Agreement ${id} successfully deleted.`);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleSaleAgreementDecline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    const updatedAgreement = await SaleAgreement.findByIdAndUpdate(
      id,
      {
        status: AGREEMENT_STATUS.Declined,
      },
      {
        new: true,
      },
    );

    const updatedProperty = await changePropertyStatus(
      property,
      PROPERTY_STATUS.Free,
    );
    res.locals.property = updatedProperty;
    res.status(200).send(updatedAgreement);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleSaleAgreementComplete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    const updatedAgreement = await SaleAgreement.findByIdAndUpdate(
      id,
      {
        status: AGREEMENT_STATUS.Completed,
      },
      {
        new: true,
      },
    );

    const updatedProperty = await changePropertyStatus(
      property,
      PROPERTY_STATUS.Sold,
    );
    res.locals.property = updatedProperty;
    res.status(200).send(updatedAgreement);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
