import { Router } from "express";
import { photoUpload } from "@/utils/media";
import {
  validatePropertyReviewBody,
  validateUserReviewBody,
  checkPropertyReviewIdParam,
  checkUserReviewIdParam,
  checkIfPropertyReviewAuthor,
  checkIfUserReviewAuthor,
} from "@/middlewares/reviews";
import { verifyJWToken } from "@/middlewares/token";
import { generateErrorMesaage } from "@/utils/common";
import PropertyReview from "@/models/Review/PropertyReview";
import UserReview from "@/models/Review/UserReview";

const reviewRouter = Router();

reviewRouter.post(
  "/user/add",
  verifyJWToken,
  validateUserReviewBody,
  async (req, res) => {
    try {
      const review = new UserReview(req.body);
      await review.save();
      res.status(201).send(review);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

reviewRouter.post(
  "/property/add",
  verifyJWToken,
  validatePropertyReviewBody,
  photoUpload.array("photos"),
  async (req, res) => {
    try {
      const review = new PropertyReview({
        ...req.body,
        ...(req.files && { photos: req.files }),
      });
      await review.save();
      res.status(201).send(review);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

reviewRouter.delete(
  "/property/remove/:id",
  verifyJWToken,
  checkPropertyReviewIdParam,
  checkIfPropertyReviewAuthor,
  async (req, res) => {
    try {
      await PropertyReview.findByIdAndDelete(req.params.id);
      res.status(200).send(`Property review ${req.params.id} deleted!`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

reviewRouter.delete(
  "/user/remove/:id",
  verifyJWToken,
  checkUserReviewIdParam,
  checkIfUserReviewAuthor,
  async (req, res) => {
    try {
      await UserReview.findByIdAndDelete(req.params.id);
      res.status(200).send(`User review ${req.params.id} deleted!`);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

reviewRouter.put(
  "/property/update/:id",
  verifyJWToken,
  checkPropertyReviewIdParam,
  checkIfPropertyReviewAuthor,
  validatePropertyReviewBody,
  photoUpload.array("photos"),
  async (req, res) => {
    try {
      const updatedReview = await PropertyReview.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedAt: new Date().toISOString(),
        },
        {
          new: true,
        },
      );
      res.status(200).send(updatedReview);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

reviewRouter.put(
  "/user/update/:id",
  verifyJWToken,
  checkUserReviewIdParam,
  checkIfUserReviewAuthor,
  validateUserReviewBody,
  async (req, res) => {
    try {
      const updatedReview = await UserReview.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          updatedAt: new Date().toISOString(),
        },
        {
          new: true,
        },
      );

      res.status(200).send(updatedReview);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default reviewRouter;
