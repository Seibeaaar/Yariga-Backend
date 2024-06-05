import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import ClientPreferencesSchema from "./ClientPreferences";
import { USER_ROLE } from "@/enums/user";

const RoleBasedFields = {
  agreements: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Agreement",
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
  taxNumber: String,
  clients: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: undefined,
  },
  preferences: {
    type: ClientPreferencesSchema,
    default: undefined,
  },
};

const UserSchema = new Schema({
  email: {
    value: {
      type: String,
      required: true,
    },
    verified: Boolean,
  },
  password: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: String,
  phoneNumber: String,
  profilePicture: String,
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
      values: Object.values(USER_ROLE),
    },
  },
  ...RoleBasedFields,
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
