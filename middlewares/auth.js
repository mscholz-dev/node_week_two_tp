const auth = {
  isAuth: (req, res, next) => {
    if (!req.session.loggedIn) {
      if (req.session) req.session.destroy();
      return res.redirect("/");
    }

    next();
  },
};

export const { isAuth } = auth;
