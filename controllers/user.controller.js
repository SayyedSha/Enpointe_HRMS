import userModel from "../models/user.model.js";
import userCompanyDetailModel from "../models/userCompanyDetails.model.js";
import userLocationModel from "../models/userLocation.model.js";
import { generateAccess, generatePassword } from "../utils/generalFunctions.js";

export const addEmplyee = async (req,res)=>{
    try{
        let {firstName, lastName, gender, bloodGroup, dateOfBirth, email, phone, alternatePhone, currentAddress, permanentAddress, dateOfJoin, officialEmail, posts, designation, department, employmentType, appraisalDate} = req.body;


        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

        const emailUser = await userModel.findOne({ email });
        if (emailUser ) {
            return res.status(409).json({
              success: false,
              error: `User with same ${email} already exist`,
            });
          }
        
        const fullName = firstName + " " + lastName;
        
        const tempPassword = generatePassword()
        console.log(tempPassword)

        const userData = {
            firstName,
            lastName,
            fullName,
            gender,
            bloodGroup,
            dateOfBirth,
            email,
            password:tempPassword,
            phone,
            alternatePhone,
            roles:"Admin",
            isTemp:true
        }

        const savedUser = await userModel.create(userData);
        
        currentAddress.user= savedUser._id
        currentAddress.addressType= "Current"
        permanentAddress.user= savedUser._id
        permanentAddress.addressType= "Permanent"
        await userLocationModel.insertMany([currentAddress,permanentAddress])
        
        const companyDetail = {
            user:savedUser._id,
            dateOfJoin,
            officialEmail,
            posts,
            designation,
            department,
            employmentType,
            appraisalDate:appraisalDate
        }
        await userCompanyDetailModel.create(companyDetail)

        res.status(201).json({ 
                success:true,
                message: 'Employee added successfully' 
            })
            ;

    }catch(err){
        console.error("Error adding employee: ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req,res)=>{
    try{
        const {email, password} = req.body;

        const userDetail = await userCompanyDetailModel.findOne({officialEmail:email});
        if(!userDetail){
            return res.status(401).json({
                success: false,
                error: "Invalid user credentials",
                });
        }

        let [loggedInUser] = await userModel.find({$and:[{_id:userDetail.user},{isDeleted:false},{isActive:true}]});
        if (!loggedInUser){
            return res.status(401).json({
                success: false,
                error: "Invalid user credentials",
                });
        }

        const isPasswordValid = await loggedInUser.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({
            success: false,
            error: "Invalid user credentials",
            });
        }
        const accessToken = await generateAccess(loggedInUser._id)
        console.log(accessToken)
        const user = {
            _id:loggedInUser._id,
            firstName:loggedInUser.firstName,
            lastName:loggedInUser.lastName,
            fullName:loggedInUser.fullName,
            officialEmail: email,
            roles:loggedInUser.roles,
            accessToken:accessToken.accessToken
        }

        return res.status(200).json({
            success: true,
            message: "User logged In Successfully",
            user
        });

    }catch(err){
        console.error("Error adding employee: ", err);
        res.status(500).json({ 
            success:false,
            message: 'Internal server error' 
        });
    }
}