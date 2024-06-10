import { Request, Response } from "express";

import { NotificationHandler } from "@/utils/notification";
import { NOTIFICATION_TYPE } from "@/enums/notification";
import { generateErrorMesaage } from "@/utils/common";

export const notifyAgreementCreated = async (req: Request, res: Response) => {
  try {
    const { property, profile, agreement } = res.locals;

    const notificationHandler = new NotificationHandler(
      property,
      profile,
      agreement,
      NOTIFICATION_TYPE.AgreementCreate,
    );
    const notification = await notificationHandler.createNotification();

    await notificationHandler.sendNotification(notification.toObject());
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyAgreementUpdated = async (req: Request, res: Response) => {
  try {
    const { sale, property, profile } = res.locals;

    const notificationHandler = new NotificationHandler(
      property,
      profile,
      sale,
      NOTIFICATION_TYPE.AgreementCreate,
    );
    const notification = await notificationHandler.createNotification();

    await notificationHandler.sendNotification(notification.toObject());
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyAgreementAccepted = async (req: Request, res: Response) => {
  try {
    const { sale, profile, property } = res.locals;

    const notificationHandler = new NotificationHandler(
      property,
      profile,
      sale,
      NOTIFICATION_TYPE.AgreementCreate,
    );
    const notification = await notificationHandler.createNotification();

    await notificationHandler.sendNotification(notification.toObject());
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyAgreementCanceled = async (req: Request, res: Response) => {
  try {
    const { sale, profile, property } = res.locals;

    const notificationHandler = new NotificationHandler(
      property,
      profile,
      sale,
      NOTIFICATION_TYPE.AgreementCreate,
    );
    const notification = await notificationHandler.createNotification();

    await notificationHandler.sendNotification(notification.toObject());
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};

export const notifyAgreementCompleted = async (req: Request, res: Response) => {
  try {
    const { sale, profile, property } = res.locals;

    const notificationHandler = new NotificationHandler(
      property,
      profile,
      sale,
      NOTIFICATION_TYPE.AgreementCreate,
    );
    const notification = await notificationHandler.createNotification();

    await notificationHandler.sendNotification(notification.toObject());
  } catch (e) {
    res.status(500).send(generateErrorMesaage(e));
  }
};
