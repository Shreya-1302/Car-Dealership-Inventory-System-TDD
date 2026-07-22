const registerUser = require('../../services/registeruser');
const loginUser = require('../../services/loginuser');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await registerUser({ email, password });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser({ email, password });

        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
