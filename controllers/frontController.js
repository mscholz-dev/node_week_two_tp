import User from "../models/User.js";

export default class FrontController {
  index(req, res) {
    const bannerText = req.flash("banner") || "";

    res.render("index", {
      banner: bannerText,
      firstName: req.flash("firstName"),
      lastName: req.flash("lastName"),
      email: req.flash("email"),
      password: req.flash("password"),
      loggedIn: req?.session?.loggedIn,
    });
  }

  login(req, res) {
    const bannerText = req.flash("banner").length > 0 ? req.flash("banner") : "";

    res.render("login", {
      banner: bannerText,
      email: req.flash("email"),
      password: req.flash("password"),
      loggedIn: req?.session?.loggedIn,
    });
  }

  async dashboard(req, res) {
    const user = await User.findOne({ email: req.session.email });

    const bannerText = req.flash("banner").length > 0 ? req.flash("banner") : "";

    res.render("dashboard", {
      banner: bannerText,
      user,
    });
  }
}
