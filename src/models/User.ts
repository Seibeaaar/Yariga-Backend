import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "@/constants/users";

const UserSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  dateOfBirth: String,
  taxNumber: {
    type: String,
    unique: true,
    default: undefined,
  },
  avatar: String,
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
  // Role-specific fields
  // Default undefined is needed to prevent fields from saving in a doc
  sales: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
    default: undefined,
  },
  properties: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    default: undefined,
  },
  clients: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    default: undefined,
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

export default model("User", UserSchema);
