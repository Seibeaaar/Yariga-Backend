import { Request, Response, NextFunction } from "express";
import UserReview from "@/models/Review/UserReview";
import PropertyReview from "@/models/Review/PropertyReview";
import { generateErrorMesaage } from "@/utils/common";
import { checkIfPropertyExists } from "@/utils/property";
import { checkIfUserExists } from "@/utils/profile";

export const validateUserReviewBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await UserReview.validate(req.body);
    const receiver = await checkIfUserExists(req.body.receiver);
    req.body.receiver = receiver;
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};

export const checkIfUserReviewAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userReview, profile } = res.locals;
    if (userReview.author !== profile.id) {
      throw new Error(
        "You are not allowed to perform any operations on this review!",
      );
    }
    next();
  } catch (e) {
    res.status(403).send(generateErrorMesaage(e));
  }
};

export const checkUserReviewIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.params.id) {
      res.statusCode = 400;
      throw new Error("No user review id provided");
    }

    const review = await UserReview.findById(req.params.id);
    if (!review) {
      res.statusCode = 404;
      throw new Error(`No user review with id ${req.params.id} found!`);
    }
    res.locals.userReview = review.populate("user", "rating votes");
    next();
  } catch (e) {
    res.send(generateErrorMesaage(e));
  }
};

export const checkPropertyReviewIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.params.id) {
      res.statusCode = 400;
      throw new Error("No property review id provided");
    }

    const review = await PropertyReview.findById(req.params.id);
    if (!review) {
      res.statusCode = 404;
      throw new Error(`No property review with id ${req.params.id} found!`);
    }
    res.locals.propertyReview = review.populate("property", "rating votes");
    next();
  } catch (e) {
    res.send(generateErrorMesaage(e));
  }
};

export const checkIfPropertyReviewAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { propertyReview, profile } = res.locals;
    if (propertyReview.author !== profile.id) {
      throw new Error(
        "You are not allowed to perform any operations on this review!",
      );
    }
    next();
  } catch (e) {
    res.status(403).send(generateErrorMesaage(e));
  }
};

export const validatePropertyReviewBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PropertyReview.validate(req.body);
    const property = await checkIfPropertyExists(req.body.property);
    res.locals.property = property;
    next();
  } catch (e) {
    res.status(400).send(generateErrorMesaage(e));
  }
};
