import mongoose, {Schema} from "mongoose";


const userCompanyDetailSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"userModel"
        },
        dateOfJoin:{
            type:Date,
            required:[true,"Please give date of joining"]
        },
        officialEmail:{
            type:String,
            required:[true,"Official Email is required"],
            unique:true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Invalid email format",
            },
        },
        posts:{
            type:String
        },
        designation:{
            type:String,
        },
        department:{
            type:String,
        },
        employmentType:{
            type:String,
            enum:["Probation","Permanent"]
        },
        appraisalDate:{
            type:Date,
        }

    }
);

const userCompanyDetailModel = (mongoose.models.userCompanyDetail || mongoose.model("userCompanyDetail", userCompanyDetailSchema));

export default userCompanyDetailModel;