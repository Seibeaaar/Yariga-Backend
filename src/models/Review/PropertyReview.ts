import { Schema, model } from "mongoose";
import { REVIEW_TAG } from "@/enums/reviews";

const PropertyReviewSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    default: undefined,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    max: 5,
    min: 0,
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  tags: {
    type: [
      {
        type: String,
        enum: {
          values: Object.values(REVIEW_TAG),
        },
      },
    ],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: "At least one review tag required",
    },
  },
  content: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => v.length > 100,
      message: "Review should be at least 100 charactrs long",
    },
  },
  photos: {
    type: [String],
    validate: {
      validator: (v: string[]) => v.length <= 10,
      message: "Max review photos - 10",
    },
  },
});

export default model("PropertyReview", PropertyReviewSchema);
