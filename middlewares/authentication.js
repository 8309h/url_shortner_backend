const jwt = require('jsonwebtoken');
const blacklist = require('../models/blacklistModel');

const authenticate = async (req, res, next) => {
    try {
        let token = req.cookies && req.cookies.normaltoken; // Check if req.cookies exists before accessing its properties

        if (!token) {
            token = req.headers.authorization;

            if (!token || !token.startsWith('Bearer ')) {
                return res.status(401).json({ msg: 'Unauthorized' });
            }

            token = token.split(' ')[1].trim();
        }

        const isBlacklisted = await blacklist.findOne({ normaltoken: token });

        if (isBlacklisted) {
            return res.status(401).json({ msg: 'You have been logged out. Please login again.' });
        }

        const decoded = jwt.verify(token, process.env.normalkey);
        req.user = decoded; // Optionally set the decoded user on the request object for further use
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ msg: 'Unauthorized' });
    }
};

module.exports = authenticate;
