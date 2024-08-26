import { generateErrorMesaage } from "@/utils/common";
import { Request, Response, NextFunction } from "express";
import Agreement from "@/models/Agreement";
import User from "@/models/User";
import Property from "@/models/Property";

import { AGREEMENT_STATUS } from "@/enums/agreement";
import { PROPERTY_STATUS } from "@/enums/property";

export const handleAgreementCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agreement = new Agreement({
      ...req.body,
      status: AGREEMENT_STATUS.Pending,
    });
    await agreement.save();

    const { seller, buyer, id } = agreement;

    await User.findByIdAndUpdate(
      seller,
      {
        $push: {
          agreements: id,
        },
      },
      {
        new: true,
      },
    );
    await User.findByIdAndUpdate(
      buyer,
      {
        $push: {
          agreements: id,
        },
      },
      {
        new: true,
      },
    );
    res.status(201).send(agreement);
    res.locals.agreement = agreement;
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleAgreementUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sale } = res.locals;
    const updatedSale = await Agreement.findByIdAndUpdate(
      sale.id,
      {
        status: AGREEMENT_STATUS.Changed,
      },
      {
        new: true,
      },
    );
    res.status(200).send(updatedSale);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleAgreementAccept = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sale } = res.locals;
    const updatedSale = await Agreement.findByIdAndUpdate(
      sale.id,
      {
        status: AGREEMENT_STATUS.Settled,
      },
      {
        new: true,
      },
    );
    const updatedProperty = await Property.findByIdAndUpdate(
      sale.property,
      {
        status: PROPERTY_STATUS.Reserved,
      },
      {
        new: true,
      },
    );

    res.locals.property = updatedProperty;

    res.status(200).send({
      sale: updatedSale,
      property: updatedProperty,
    });

    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleAgreementDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      sale: { id, property, seller, buyer },
    } = res.locals;
    await Agreement.findByIdAndDelete(id);
    await Property.findByIdAndUpdate(
      property,
      {
        status: PROPERTY_STATUS.Free,
      },
      {
        new: true,
      },
    );
    await User.findByIdAndUpdate(
      seller,
      {
        $pull: {
          sales: id,
        },
      },
      {
        new: true,
      },
    );
    await User.findByIdAndUpdate(
      buyer,
      {
        $pull: {
          sales: id,
        },
      },
      {
        new: true,
      },
    );

    res.status(200).send(`Agreement ${id} successfully deleted.`);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleAgreementDecline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      sale: { id, property },
    } = res.locals;
    const updatedSale = await Agreement.findByIdAndUpdate(
      id,
      {
        status: AGREEMENT_STATUS.Declined,
      },
      {
        new: true,
      },
    );
    const updatedProperty = await Property.findByIdAndUpdate(
      property,
      {
        status: PROPERTY_STATUS.Free,
      },
      {
        new: true,
      },
    );
    res.locals.property = updatedProperty;
    res.status(200).send(updatedSale);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const handleAgreementComplete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      sale: { id, property },
    } = res.locals;
    const updatedSale = await Agreement.findByIdAndUpdate(
      id,
      {
        status: AGREEMENT_STATUS.Completed,
      },
      {
        new: true,
      },
    );
    const updatedProperty = await Property.findByIdAndUpdate(
      property,
      {
        status: PROPERTY_STATUS.Sold,
      },
      {
        new: true,
      },
    );
    res.locals.property = updatedProperty;
    res.status(200).send(updatedSale);
    next();
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
