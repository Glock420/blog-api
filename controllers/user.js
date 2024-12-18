const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { createAccessToken, errorHandler } = require('../auth.js')

module.exports.registerUser = (req, res) => {
	let newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10)
	});

	if(!newUser.email.includes('@')) {
		return res.status(400).json({ error: 'Email invalid' });
	}
	if(req.body.password.length < 8) {
		return res.status(400).json({ error: 'Password must be atleast 8 characters' });
	}

	return newUser.save()
	.then(result => res.status(201).json({ message: 'Registered Successfully' }))
	.catch(err => errorHandler(err, req, res));
};

module.exports.loginUser = (req, res) => {
	if(req.body.email.includes('@')) {
		return User.findOne({ email: req.body.email })
		.then(result => {
			if(result === null || result.length < 0) {
				return res.status(404).json({ error: 'No email found' });
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect) {
					return res.status(200).json({ access: createAccessToken(result) });
				} else {
					return res.status(401).json({ error: 'Email and password do not match' });
				}
			}
		})
		.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).json({ error: 'Invalid Email' });
	}
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(result => {
        if(!result) {
            return res.status(404).send({ error: 'User not found' });
        } else {
            result.password = "";
            return res.status(200).send({ user: result });
        }  
    })
    .catch(error => errorHandler(error, req, res));
};