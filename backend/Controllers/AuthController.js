const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    try{
        console.log('📝 Signup request received:', { name: req.body.name, email: req.body.email });
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email});
        if(user) {
            return res.status(400)
            .json({ message: 'User already exists, please Login', success: false});
        }
        const userModel = new UserModel({name, email, password});
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        console.log('✅ User registered successfully:', email);
        res.status(201)
        .json ({
            message: "User registered successfully",
            success: true
        })

    } catch(err) {
            console.error("❌ Error during signup:", err.message, err.stack); 
        res.status(500)
        .json({
            message: "Internal Server Error",
            success : false,
            error: err.message
        })

    }
}

const login = async (req, res) => {
    try{
        console.log('🔐 Login request received for email:', req.body.email);
        const { email, password } = req.body;
        
        if (!process.env.JWT_SECRET) {
            console.error('🚨 JWT_SECRET is not configured in environment!');
            return res.status(500).json({ message: "Server configuration error", success: false });
        }
        
        const user = await UserModel.findOne({ email});
        const errorMsg = "Auth failed email or password is wrong";
        if(!user) {
            return res.status(400)
            .json({ message: errorMsg, success: false});
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual) {
            return res.status(403)
            .json({ message: errorMsg, success: false});
        }

        const jwtToken = jwt.sign({
            email : user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h'
        })

        console.log('✅ User logged in successfully:', email);
        res.status(200)
        .json ({
            message: "Logged in successfully",
            success: true,
            jwtToken,
            email,
            name: user.name
        })

    } catch(err) {
            console.error("❌ Error during login:", err.message, err.stack); 
        res.status(500)
        .json({
            message: "Internal Server Error",
            success : false,
            error: err.message
        })

    }
}

module.exports = {
    signup,
    login
};