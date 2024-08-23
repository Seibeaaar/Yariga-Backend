import { Request, Response, NextFunction } from "express";

import { AGREEMENT_STATUS } from "@/enums/agreement";
import { PROPERTY_STATUS } from "@/enums/property";
import RentAgreement from "@/models/Agreement/RentAgreement";
import { generateErrorMesaage } from "@/utils/common";

import { changePropertyStatus } from "@/utils/property";

export const handleRentAgreementCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agreement = new RentAgreement({
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

export const handleRentAgreementUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { agreement } = res.locals;
    const updatedAgreement = await RentAgreement.findByIdAndUpdate(
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

export const handleRentAgreementAccept = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { agreement } = res.locals;

    const updatedAgreement = await RentAgreement.findByIdAndUpdate(
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

export const handleRentAgreementDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    await RentAgreement.findByIdAndDelete(id);

    await changePropertyStatus(property, PROPERTY_STATUS.Free);

    res.status(200).send(`Agreement ${id} successfully deleted.`);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleRentAgreementDecline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    const updatedAgreement = await RentAgreement.findByIdAndUpdate(
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

export const handleRentAgreementComplete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      agreement: { id, property },
    } = res.locals;
    const updatedAgreement = await RentAgreement.findByIdAndUpdate(
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
