import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  name: { type: String, require: true, unique: true },
  password: { type: String, require: true }
}, {
  timestamps: true
});

UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if(!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt( config.get("saltWorkFactor") );
  const hash = bcrypt.hashSync( user.password, salt );

  user.password = hash;
  
  return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
}

export default mongoose.model<UserDocument>("User", UserSchema);