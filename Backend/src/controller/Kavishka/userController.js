const User = require("../../models/kavishka/resident");

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);

        const userType = user.userType;

        res.status(200).json({ email, token, userType });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signupUser = async (req, res) => {
    const { userType, name, phoneNumber, email, password } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const user = await User.signup(userType, name, phoneNumber, email, password);
        const token = createToken(user._id);

        res.status(200).json({ email, token, userType });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




module.exports = { signupUser, loginUser };
