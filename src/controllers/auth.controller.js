const { Router } = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({
            auth: false,
            message: 'Debe completar los datos'
        });
    }

    const userDB = await User.findOne({username, email});

    if (userDB) {
        return res.status(400).json({
            auth: false,
            message: 'El email ya ha sido registrado'
        })
    }

    const user = new User({
        username,
        email,
        password
    });

    user.password = await user.encryptPassword(user.password);

    await user.save();

    res.status(201).json({
        auth: true,
        message: 'Se registró correctamente'
    });
});

router.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email: email});

    if(!user) {
        return res.status(401).json({
            auth: false,
            message: 'Email o contraseña incorrectos'
        });
    }

    const isValid = user.validatePassword(password);

    if(!isValid) {
        return res.status(401).json({
            auth: false,
            message: 'Email o contraseña incorrectos'
        });
    }

    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET || 'my-secret-token', {
        expiresIn: 3600 //segundos
    });

    res.json({auth: true, token});
});

router.get('/api/profile', async (req, res) => {
    const token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({
            auth: false,
            message: 'Debe autenticarse'
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'my-secret-token');
        const user = await User.findById(decoded.id, { password: 0 });

        res.status(200).json(user);

    } catch(e) {

        res.status(500).json({
            message: 'El token no es valido'
        });
    }
});

module.exports = router;