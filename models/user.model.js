import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        firstName:{
            type:String,
            required:[true,"First Name is required"],
            trim: true,
            validate: {
                validator: (value) => /^[A-Za-z]+$/.test(value),
                message: "First name must contain only alphabetical characters",
            },
        },
        lastName:{
            type:String,
            required:[true,"Last Name is required"],
            trim: true,
            validate: {
                validator: (value) => /^[A-Za-z]+$/.test(value),
                message: "Last name must contain only alphabetical characters",
            },
        },
        fullName:{
            type:String,
            required:[true,"Full Name is required"],
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: true,
        },
        bloodGroup :{
            type:String,
            enum:["A+","A-","B+","B-","AB+","AB-","O+","O-","Rh+","Rh-"]
        },
        dateOfBirth:{
            type:Date,
            required:[true,"Date of birth is require"]
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Invalid email format",
            },
        },
        phone:{
            type:String,
            required:[true,"Phone number is required"],
            validate: {
                validator: (value) => {
                    return /^\d+$/.test(value);
                },
                message: "Invalid phone number format",
            },
        },
        alternatePhone:{
            type:String,
            validate: {
                validator: (value) => {
                    return /^\d+$/.test(value);
                },
                message: "Invalid phone number format",
            },
        },
        password:{
            type:String,
            required:[true,"Passowrd is required"],
            validate: {
                validator: (value) =>
                    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value),
                message:
                    "Password must be at least 8 characters long, contain at least one uppercase letter, at least one number, and at least one special character (!@#$%^&*)",
            },
        },
        roles:{
            type:String,
            enum:['Admin','User']
        },
        isActive:{
            type:Boolean,
            default:true
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        isTemp:{
            type:Boolean,
        }
    },
    {
        timestamps:true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});


userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

const userModel = (mongoose.models.User  || mongoose.model("User", userSchema));


export default userModel;
