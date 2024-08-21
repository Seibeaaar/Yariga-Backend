import { Router } from "express";
import { checkIfLandlord, checkIfClient } from "@/middlewares/profile";
import { extractProfileFromToken, verifyJWToken } from "@/middlewares/token";

import {
  handleSaleAgreementCreation,
  handleSaleAgreementAccept,
  handleSaleAgreementComplete,
  handleSaleAgreementDecline,
  handleSaleAgreementUpdate,
  handleSaleAgreementDelete,
} from "./handlers/sale";

import {
  notifyAgreementCreated,
  notifyAgreementAccepted,
  notifyAgreementCanceled,
  notifyAgreementCompleted,
  notifyAgreementUpdated,
} from "./notifiers";
import {
  validateSaleAgreementBody,
  validateSaleAgreementInfo,
  checkSaleAgreementIdParam,
} from "@/middlewares/agreement/sale";
import {
  checkRentAgreementIdParam,
  validateRentAgreementBody,
  validateRentAgreementInfo,
} from "@/middlewares/agreement/rent";
import {
  handleRentAgreementAccept,
  handleRentAgreementComplete,
  handleRentAgreementCreation,
  handleRentAgreementDecline,
  handleRentAgreementDelete,
  handleRentAgreementUpdate,
} from "./handlers/rent";

const AgreementRouter = Router();

AgreementRouter.post(
  "/sale/create",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  validateSaleAgreementBody,
  validateSaleAgreementInfo,
  handleSaleAgreementCreation,
  notifyAgreementCreated,
);

AgreementRouter.put(
  "/sale/:id/update",
  verifyJWToken,
  extractProfileFromToken,
  checkSaleAgreementIdParam,
  validateSaleAgreementBody,
  validateSaleAgreementInfo,
  handleSaleAgreementUpdate,
  notifyAgreementUpdated,
);

AgreementRouter.put(
  "/sale/:id/accept",
  verifyJWToken,
  extractProfileFromToken,
  checkSaleAgreementIdParam,
  handleSaleAgreementAccept,
  notifyAgreementAccepted,
);

AgreementRouter.delete(
  "/sale/:id/delete",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkSaleAgreementIdParam,
  handleSaleAgreementDelete,
  notifyAgreementCanceled,
);

AgreementRouter.put(
  "/sale/:id/decline",
  verifyJWToken,
  extractProfileFromToken,
  checkSaleAgreementIdParam,
  handleSaleAgreementDecline,
  notifyAgreementCanceled,
);

AgreementRouter.post(
  "/sale/:id/complete",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  checkSaleAgreementIdParam,
  handleSaleAgreementComplete,
  notifyAgreementCompleted,
);

AgreementRouter.post(
  "/rent/create",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  validateRentAgreementBody,
  validateRentAgreementInfo,
  handleRentAgreementCreation,
  notifyAgreementCreated,
);

AgreementRouter.put(
  "/rent/:id/update",
  verifyJWToken,
  extractProfileFromToken,
  checkRentAgreementIdParam,
  validateRentAgreementBody,
  validateRentAgreementInfo,
  handleRentAgreementUpdate,
  notifyAgreementUpdated,
);

AgreementRouter.put(
  "/rent/:id/accept",
  verifyJWToken,
  extractProfileFromToken,
  checkRentAgreementIdParam,
  handleRentAgreementAccept,
  notifyAgreementAccepted,
);

AgreementRouter.delete(
  "/rent/:id/delete",
  verifyJWToken,
  extractProfileFromToken,
  checkIfClient,
  checkRentAgreementIdParam,
  handleRentAgreementDelete,
  notifyAgreementCanceled,
);

AgreementRouter.put(
  "/rent/:id/decline",
  verifyJWToken,
  extractProfileFromToken,
  checkRentAgreementIdParam,
  handleRentAgreementDecline,
  notifyAgreementCanceled,
);

AgreementRouter.post(
  "/rent/:id/complete",
  verifyJWToken,
  extractProfileFromToken,
  checkIfLandlord,
  checkRentAgreementIdParam,
  handleRentAgreementComplete,
  notifyAgreementCompleted,
);

export default AgreementRouter;
