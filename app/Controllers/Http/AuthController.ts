import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async index({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  public async login({request, auth, response, session }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      await auth.use("web").attempt(email, password);
      session.flash({ success: "Welcome back :)" });
      response.redirect().toRoute("home");
    } catch (error) {
      session.flash({ error: "Invalid credentials :(" });
      throw error;
    }
  }

  public async register({ view }: HttpContextContract) {
    return view.render("auth/register");
  }

  public async create({ request, response, session, auth }) {
    const { name, email, password, confirmPassword } = await request.all(); // get all fields

    const user = await User.create({ name: name, email: email, password: password }); // create new user with variables values
    try {
  //await auth.login(user);
      // verification
      if (!name || !email || !password || !confirmPassword) {
        session.flash({ error: "Please enter all required fields" });
        response.redirect().back();
      } else if (password !== confirmPassword) {
        session.flash({ error: "Passwords do not match" });
        response.redirect().back();
      } else {
        session.flash({ success: "Success !" });
        response.redirect().toRoute("login");
      }
    } catch (error) {
      throw error;
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use("web").logout();
    response.redirect().toRoute("home");
  }
}
