import { Router } from "express";
import Notification from "@/models/Notification";
import { verifyJWToken, extractProfileFromToken } from "@/middlewares/token";
import { checkNotificationExists } from "@/middlewares/notification";
import { COMMON_SERVER_ERROR } from "@/constants/server";

const NotificationRouter = Router();

NotificationRouter.get(
  "/",
  verifyJWToken,
  extractProfileFromToken,
  async (req, res) => {
    try {
      const { profile } = res.locals;
      const notifications = await Notification.find({
        receiver: profile.id,
      });

      res.status(200).send(notifications);
    } catch (e) {
      res.status(500).send(COMMON_SERVER_ERROR);
    }
  },
);

NotificationRouter.delete(
  "/:id",
  verifyJWToken,
  extractProfileFromToken,
  checkNotificationExists,
  async (req, res) => {
    try {
      await Notification.findByIdAndDelete(req.params.id);

      res.status(200).send("Notification successfully deleted");
    } catch (e) {
      res.status(500).send(COMMON_SERVER_ERROR);
    }
  },
);

export default NotificationRouter;
