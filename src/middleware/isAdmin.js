module.exports = (req, res, next) => {
    if (!req.user) {
        res.redirect('/account/login');
    }
    else {
        if (req.user.role !== 'admin') {
            res.redirect('/');
        }
    }
    next();
}