import { Router } from "express";

import Sale from "@/models/Sale";
import User from "@/models/User";
import Property from "@/models/Property";

import { PROPERTY_STATUS } from "@/enums/property";
import {
  validateSalesBody,
  checkIfClient,
  checkIfSeller,
  checkSaleIdParam,
  validateSalesInfo,
} from "@/middlewares/sales";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { SALES_STATUS } from "@/enums/sales";

const SalesRouter = Router();

SalesRouter.post(
  "/create",
  verifyJWToken,
  extractProfileFromToken,
  checkIfSeller,
  validateSalesBody,
  validateSalesInfo,
  async (req, res) => {
    try {
      const sale = new Sale({
        ...req.body,
        status: SALES_STATUS.Pending,
      });
      await sale.save();
      const { seller, buyer, property } = req.body;
      await User.findByIdAndUpdate(
        seller,
        {
          $push: {
            sales: sale.id,
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
            sales: sale.id,
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
      res.status(201).send(sale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

SalesRouter.put(
  "/update/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfSeller,
  checkSaleIdParam,
  validateSalesBody,
  validateSalesInfo,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Sale.findByIdAndUpdate(sale.id, req.body, {
        new: true,
      });
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

SalesRouter.put(
  "/accept/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkSaleIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Sale.findByIdAndUpdate(
        sale.id,
        {
          status: SALES_STATUS.Completed,
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

SalesRouter.delete(
  "/delete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfSeller,
  checkSaleIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      await Sale.findByIdAndDelete(sale.id);
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

SalesRouter.put(
  "/decline/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkSaleIdParam,
  async (req, res) => {
    try {
      const { sale } = res.locals;
      const updatedSale = await Sale.findByIdAndUpdate(
        sale.id,
        {
          status: SALES_STATUS.Declined,
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

export default SalesRouter;
