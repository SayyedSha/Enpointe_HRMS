import mongoose,{Schema} from "mongoose";

const userLocationSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"userModel"
        },
        line1:{
            type: String,
            required: [true, "Please enter proper address"]
        },
        line2:{
            type: String,
        },
        city:{
            type: String,
            required: [true, "Please enter city name"]
        },
        state:{
            type: String,
            required: [true, "Please enter state name"]
        },
        country:{
            type: String,
            required: [true, "Please enter country name"]
        },
        pincode:{
            type: String,
            required: [true, "Please entre zip code"]
        },
        addressType:{
            type:String,
            enum:["Permanent","Current"]
        }
    }
);

const userLocationModel = (mongoose.models.userLocation || mongoose.model("userLocation",userLocationSchema));

export default userLocationModel;