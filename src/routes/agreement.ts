import { Router } from "express";

import Agreement from "@/models/Agreement";
import User from "@/models/User";
import Property from "@/models/Property";

import { PROPERTY_STATUS } from "@/enums/property";
import {
  validateAgreementBody,
  checkAgreementIdParam,
  validateAgreementInfo,
} from "@/middlewares/agreement";
import { checkIfLandlord, checkIfClient } from "@/middlewares/profile";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import { AGREEMENT_STATUS } from "@/enums/agreement";

import { io } from "../index";
import { getCounterpartConnection } from "@/utils/socket";
import { constructAgreementNotification } from "@/utils/notification";
import { NOTIFICATION_TYPE } from "@/enums/notification";
import Notification from "@/models/Notification";

const AgreementRouter = Router();

AgreementRouter.get(
  "/",
  verifyJWToken,
  extractProfileFromToken,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const agreements = await Agreement.findById(profile.id);
      res.status(200).send(agreements);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

AgreementRouter.post(
  "/create",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  validateAgreementBody,
  validateAgreementInfo,
  async (req, res) => {
    try {
      const { profile, property } = res.locals;
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

      const notification = new Notification({
        sender: buyer,
        receiver: seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.AgreementCreate,
          property.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [seller.toString(), buyer.toString()],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.AgreementCreate,
          notification,
        );
      }

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
      const { sale, property, profile } = res.locals;
      const updatedSale = await Agreement.findByIdAndUpdate(
        sale.id,
        {
          ...req.body,
          status: AGREEMENT_STATUS.Changed,
        },
        {
          new: true,
        },
      );

      const notification = new Notification({
        sender: sale.buyer,
        receiver: sale.seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.AgreementUpdate,
          property.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [sale.buyer, sale.seller],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.AgreementUpdate,
          notification,
        );
      }
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
      const { sale, profile } = res.locals;
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

      const notification = new Notification({
        sender: sale.buyer,
        receiver: sale.seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.AgreementSuccess,
          updatedProperty!.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [sale.buyer, sale.seller],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.AgreementSuccess,
          notification,
        );
      }

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
      const {
        sale: { id, property, seller, buyer },
        profile,
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

      const notification = new Notification({
        sender: buyer,
        receiver: seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.AgreementCancel,
          property.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [seller, buyer],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.AgreementCancel,
          notification,
        );
      }

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
      const {
        sale: { id, property, buyer, seller },
        profile,
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
      await Property.findByIdAndUpdate(
        property,
        {
          status: PROPERTY_STATUS.Free,
        },
        {
          new: true,
        },
      );

      const notification = new Notification({
        sender: buyer,
        receiver: seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.AgreementCancel,
          property.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [seller.toString(), buyer.toString()],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.AgreementCancel,
          notification,
        );
      }
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

AgreementRouter.post(
  "/complete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  checkAgreementIdParam,
  async (req, res) => {
    try {
      const {
        sale: { buyer, seller, id, property },
        profile,
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

      const notification = new Notification({
        sender: buyer,
        receiver: seller,
        content: constructAgreementNotification(
          NOTIFICATION_TYPE.PaymentSucces,
          updatedProperty!.title,
        ),
      });
      await notification.save();

      const counterpartConnection = await getCounterpartConnection(
        [seller.toString(), buyer.toString()],
        profile.id,
      );

      if (counterpartConnection) {
        io.to(counterpartConnection).emit(
          NOTIFICATION_TYPE.PaymentSucces,
          notification,
        );
      }
      res.status(200).send(updatedSale);
    } catch (e) {
      const message = generateErrorMesaage(e);
      res.status(500).send(message);
    }
  },
);

export default AgreementRouter;
