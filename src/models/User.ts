import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "@/constants/users";

const RoleBasedFields = {
  // Sole proprietor (SP), agent, client
  sales: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],
    default: undefined,
  },
  // SP, agent, manager
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
  // SP, agent
  clients: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    default: undefined,
  },
  // Manager
  agents: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Agent",
      },
    ],
    default: undefined,
  },
  // Agent
  licenseNumber: String,
};

const UserSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  phoneNumber: String,
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
