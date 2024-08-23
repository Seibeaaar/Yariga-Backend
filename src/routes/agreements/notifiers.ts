import { Request, Response } from "express";

import {
  constructAgreementNotification,
  sendNotification,
} from "@/utils/notification";
import { NOTIFICATION_TYPE } from "@/enums/notification";
import { generateErrorMesaage } from "@/utils/common";
import { getAgreementCounterpart } from "@/utils/agreement";

export const notifyAgreementCreated = async (req: Request, res: Response) => {
  try {
    const { property, profile, agreement } = res.locals;

    const content = constructAgreementNotification(
      NOTIFICATION_TYPE.AgreementCreate,
      property.title,
    );

    const receiver = getAgreementCounterpart(agreement, profile.id);

    await sendNotification(
      content,
      NOTIFICATION_TYPE.AgreementCreate,
      profile.id,
      receiver,
    );
  } catch (e) {
    console.log(generateErrorMesaage(e));
  }
};

export const notifyAgreementUpdated = async (req: Request, res: Response) => {
  try {
    const { agreement, property, profile } = res.locals;

    const content = constructAgreementNotification(
      NOTIFICATION_TYPE.AgreementCreate,
      property.title,
    );

    const receiver = getAgreementCounterpart(agreement, profile.id);

    await sendNotification(
      content,
      NOTIFICATION_TYPE.AgreementUpdate,
      profile.id,
      receiver,
    );
  } catch (e) {
    console.log(generateErrorMesaage(e));
  }
};

export const notifyAgreementAccepted = async (req: Request, res: Response) => {
  try {
    const { agreement, profile, property } = res.locals;

    const content = constructAgreementNotification(
      NOTIFICATION_TYPE.AgreementSuccess,
      property.title,
    );

    const receiver = getAgreementCounterpart(agreement, profile.id);

    await sendNotification(
      content,
      NOTIFICATION_TYPE.AgreementSuccess,
      profile.id,
      receiver,
    );
  } catch (e) {
    console.log(generateErrorMesaage(e));
  }
};

export const notifyAgreementCanceled = async (req: Request, res: Response) => {
  try {
    const { agreement, profile, property } = res.locals;

    const content = constructAgreementNotification(
      NOTIFICATION_TYPE.AgreementCancel,
      property.title,
    );

    const receiver = getAgreementCounterpart(agreement, profile.id);

    await sendNotification(
      content,
      NOTIFICATION_TYPE.AgreementCancel,
      profile.id,
      receiver,
    );
  } catch (e) {
    console.log(generateErrorMesaage(e));
  }
};

export const notifyAgreementCompleted = async (req: Request, res: Response) => {
  try {
    const { agreement, profile, property } = res.locals;

    const content = constructAgreementNotification(
      NOTIFICATION_TYPE.PaymentSucces,
      property.title,
    );

    const receiver = getAgreementCounterpart(agreement, profile.id);

    await sendNotification(
      content,
      NOTIFICATION_TYPE.PaymentSucces,
      profile.id,
      receiver,
    );
  } catch (e) {
    console.log(generateErrorMesaage(e));
  }
};
