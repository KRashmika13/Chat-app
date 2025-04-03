import { generateToken } from "../lib/util.js";
import User from "../models/users.moddle.js";
import bcrypt from 'bcrypt';

export const signup = async(req, res) => {
    const { fullName, email, password} = req.body;
    try{
        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 characters..."})
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists..."})
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
            return res.status(400).json({message: "Invalid user data. Please try again."})
        }

    }catch{
        console.log("Error in signup controller", error);
        return res.status(500).json({message: "Internal server error"})
    }
}

export const login = (req, res) => {
    res.send('Login Route')
}

export const logout = (req, res) => {
    res.send('Logout Route')
}
