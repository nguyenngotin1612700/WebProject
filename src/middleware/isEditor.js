module.exports = (req, res, next) => {
    if (!req.user) {
        res.redirect('/account/login');
        return;
    }
    else {
        if (req.user.role !== 'editor') {
            res.redirect('/');
            return;
        }
    }
    next();
}