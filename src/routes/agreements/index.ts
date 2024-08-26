import { Router } from "express";

import Agreement from "@/models/Agreement";
import {
  validateAgreementBody,
  checkAgreementIdParam,
  validateAgreementInfo,
} from "@/middlewares/agreement";
import { checkIfLandlord, checkIfClient } from "@/middlewares/profile";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";

import { handleAgreementCreation, handleAgreementUpdate } from "./handlers";
import {
  notifyAgreementCreated,
  notifyAgreementAccepted,
  notifyAgreementCanceled,
  notifyAgreementCompleted,
  notifyAgreementUpdated,
} from "./notifiers";

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
  handleAgreementCreation,
  notifyAgreementCreated,
);

AgreementRouter.put(
  "/update/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  validateAgreementBody,
  validateAgreementInfo,
  handleAgreementUpdate,
  notifyAgreementUpdated,
);

AgreementRouter.put(
  "/accept/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  notifyAgreementAccepted,
);

AgreementRouter.delete(
  "/delete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkAgreementIdParam,
  notifyAgreementCanceled,
);

AgreementRouter.put(
  "/decline/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkAgreementIdParam,
  notifyAgreementCanceled,
);

AgreementRouter.post(
  "/complete/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  checkAgreementIdParam,
  notifyAgreementCompleted,
);

export default AgreementRouter;
