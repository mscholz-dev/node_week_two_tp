import bcrypt from "bcrypt";
import User from "../models/User.js";

export default class ApiController {
  async register(req, res) {
    const { firstName, lastName, email, password, password2 } = req.body;

    req.flash("firstName", firstName);
    req.flash("lastName", lastName);
    req.flash("email", email);
    req.flash("password", password);

    if (!firstName || !lastName || !email || !password || !password2) req.flash("banner", "Tous les champs doivent être compléter");
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) req.flash("banner", "L'email est invalide");
    else if (password !== password2) req.flash("banner", "Les champs mot de passe ne correspondent pas");
    else {
      const user = await User.findOne({ $or: [{ firstName }, { lastName }, { email }] });

      if (user) {
        if (user.firstName === firstName && user.lastName === lastName) req.flash("banner", "Cette personne existe déjà");
        else req.flash("banner", "Cet email existe déjà");
        return res.redirect("/");
      }

      const hash = bcrypt.hashSync(password, 10);
      await User.create({ firstName, lastName, email, password: hash });

      req.flash("banner", "");
      req.flash("firstName", "");
      req.flash("lastName", "");
      req.flash("email", "");
      req.flash("password", "");

      return res.redirect("/login");
    }

    res.redirect("/");
  }

  async login(req, res) {
    const { email, password } = req.body;

    req.flash("email", email);
    req.flash("password", password);

    if (!email || !password) req.flash("banner", "Tous les champs doivent être compléter");
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) req.flash("banner", "L'email est invalide");
    else {
      const user = await User.findOne({ email });

      if (!user) {
        req.flash("banner", "Cet email n'existe pas");
        return res.redirect("/login");
      }

      const compare = bcrypt.compareSync(password, user.password);

      if (!compare) {
        req.flash("banner", "Le mot de passe est incorrect");
        return res.redirect("/login");
      }

      req.session.loggedIn = true;
      req.session.email = user.email;

      req.flash("email", "");
      req.flash("password", "");

      return res.redirect("/dashboard");
    }

    res.redirect("/login");
  }

  async logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
}
