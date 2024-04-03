import { Router } from "express";

import Agreement from "@/models/Agreement";
import User from "@/models/User";
import Property from "@/models/Property";

import { PROPERTY_STATUS } from "@/enums/property";
import {
  validateAgreementBody,
  checkIfClient,
  checkAgreementIdParam,
  validateAgreementInfo,
} from "@/middlewares/agreement";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { AGREEMENT_STATUS } from "@/enums/agreement";

const AgreementRouter = Router();

AgreementRouter.post(
  "/create",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  validateAgreementBody,
  validateAgreementInfo,
  async (req, res) => {
    try {
      const agreement = new Agreement({
        ...req.body,
        status: AGREEMENT_STATUS.Pending,
      });
      await agreement.save();
      const { seller, buyer, property } = req.body;
      await User.findByIdAndUpdate(
        seller,
        {
          $push: {
            agreements: agreement.id,
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
            agreements: agreement.id,
          },
        },
        {
          new: true,
        },
      );
      await Property.findByIdAndUpdate(
        property,
        {
          status: PROPERTY_STATUS.Reserved,
        },
        {
          new: true,
        },
      );
      res.status(201).send(agreement);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AgreementRouter.put(
  "/update/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  validateAgreementBody,
  validateAgreementInfo,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Agreement.findByIdAndUpdate(sale.id, req.body, {
        new: true,
      });
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AgreementRouter.put(
  "/accept/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Agreement.findByIdAndUpdate(
        sale.id,
        {
          status: AGREEMENT_STATUS.Completed,
        },
        {
          new: true,
        },
      );
      await Property.findByIdAndUpdate(
        sale.property,
        {
          status: PROPERTY_STATUS.Sold,
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AgreementRouter.delete(
  "/delete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkAgreementIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      await Agreement.findByIdAndDelete(sale.id);
      await Property.findByIdAndUpdate(
        sale.property,
        {
          status: PROPERTY_STATUS.Free,
        },
        {
          new: true,
        },
      );
      await User.findByIdAndUpdate(
        sale.seller,
        {
          $pull: {
            sales: sale.id,
          },
        },
        {
          new: true,
        },
      );
      await User.findByIdAndUpdate(
        sale.buyer,
        {
          $pull: {
            sales: sale.id,
          },
        },
        {
          new: true,
        },
      );
      res.status(200).send("Successfully deleted a sale");
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AgreementRouter.put(
  "/decline/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Agreement.findByIdAndUpdate(
        sale.id,
        {
          status: AGREEMENT_STATUS.Declined,
        },
        {
          new: true,
        },
      );
      await Property.findByIdAndUpdate(
        sale.property,
        {
          status: PROPERTY_STATUS.Free,
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default AgreementRouter;
