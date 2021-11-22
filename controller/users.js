const User = require("../modules/dbusers");

exports.userSignUp = (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    const user = new User({
        email,
        password,
        firstname,
        lastname
    });
    user.save()
        .then(response => {
            res.status(200).json({ message: " user registered sucessfully", user: response })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

exports.userLogin = (req, res) => {
    const { email, password } = req.body;
    User.find({ email: email, password: password })
        .then(response => {
            if (response.length > 0) {
                res.status(200).json({ message: "user authenticated succesfully", isAuthenticated: true, user: response })
            }
            else {
                res.status(200).json({ message: "user not authenticated succesfully", isAuthenticated: false, user: response })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}