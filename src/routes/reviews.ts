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
import User from "@/models/User";
import {
  calculateRatingOnReviewCreate,
  calculateRatingOnReviewDelete,
  calculateRatingOnReviewUpdate,
} from "@/utils/review";
import Property from "@/models/Property";

const reviewRouter = Router();

reviewRouter.post(
  "/user/add",
  verifyJWToken,
  validateUserReviewBody,
  async (req, res) => {
    try {
      const review = new UserReview(req.body);
      await review.save();
      const { receiver } = res.locals;
      await User.findByIdAndUpdate(receiver.id, {
        votes: receiver.votes + 1,
        rating: calculateRatingOnReviewCreate(
          receiver.rating,
          review.rating,
          receiver.votes,
        ),
      });
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
      const { property } = res.locals;
      await Property.findByIdAndUpdate(property.id, {
        votes: property.votes + 1,
        rating: calculateRatingOnReviewCreate(
          property.rating,
          review.rating,
          property.votes,
        ),
      });
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
      const { propertyReview } = res.locals;
      const { property } = propertyReview;
      await Property.findByIdAndUpdate(property.id, {
        votes: property.votes - 1,
        rating: calculateRatingOnReviewDelete(
          property.rating,
          propertyReview.rating,
          property.votes,
        ),
      });
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
      const { userReview } = res.locals;
      const { user } = userReview;
      await User.findByIdAndUpdate(user.id, {
        votes: user.votes - 1,
        rating: calculateRatingOnReviewDelete(
          user.rating,
          userReview.rating,
          user.votes,
        ),
      });
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
      const { property, propertyReview } = res.locals;
      await Property.findByIdAndUpdate(property.id, {
        rating: calculateRatingOnReviewUpdate(
          property.rating,
          property.votes,
          propertyReview.rating,
          updatedReview!.rating,
        ),
      });
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
      const { user, userReview } = res.locals;
      await User.findByIdAndUpdate(user.id, {
        rating: calculateRatingOnReviewUpdate(
          user.rating,
          user.votes,
          userReview.rating,
          updatedReview!.rating,
        ),
      });
      res.status(200).send(updatedReview);
    } catch (e) {
      res.status(500).send(generateErrorMesaage(e));
    }
  },
);

export default reviewRouter;
