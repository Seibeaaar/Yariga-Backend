import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePhoneNumber,
  validateDateOfBirth,
  validateTaxNumber,
} from "@/validators/common";
import { USER_ROLES } from "@/constants/users";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    validate: {
      validator: validatePassword,
      message: "Invalid password format",
    },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: validateFirstName,
      message: "Invalid first name",
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: validateLastName,
      message: "Invalid last name",
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: validatePhoneNumber,
      message: "Invalid phone number",
    },
  },
  dateOfBirth: {
    type: String,
    validate: {
      validator: validateDateOfBirth,
      message: "You must be older than 18 years old",
    },
  },
  taxNumber: {
    type: String,
    validate: {
      validator: validateTaxNumber,
      message: "Invalid tax number",
    },
  },
  avatar: {
    type: String,
  },
  joinedAt: {
    type: String,
    default: new Date().toISOString(),
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    enum: {
      values: USER_ROLES,
    },
  },
});

UserSchema.pre("save", function (next) {
  if (!this.password) {
    next();
  }
  const hashed = bcrypt.hashSync(this.password!, 10);
  this.password = hashed;
  next();
});

export default model("CommonProfile", UserSchema);
