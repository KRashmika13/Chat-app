import { generateToken } from "../lib/util.js";
import User from "../models/users.moddle.js";
import bcrypt from 'bcryptjs';

export const signup = async(req, res) => {
    const { fullName, email, password} = req.body;
    try{
        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 characters..."});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists..."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                token: generateToken(newUser._id, res)
            })
        }else{
            return res.status(400).json({message: "Invalid user data. Please try again."});
        }

    }catch(error){
        console.log("Error in signup controller", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "The email was not found. Please check your email and try again."});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "The password is incorrect. Please try again."});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id, res)
        })
    }catch{
        console.log("Error in login controller", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0});
        return res.status(200).json({message: "Logout successful"});
    } catch(error) {
        console.log("Error in logout controller", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
