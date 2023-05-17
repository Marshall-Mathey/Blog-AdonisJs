import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";

export default class PostsController {
  public async index({ view }: HttpContextContract) {
    return view.render("pages/index");
  }

  public async create({ view }: HttpContextContract) {
    return view.render("pages/create");
  }

  public async store({ request, response, session }: HttpContextContract) {
    try {
      const post = new Post();
      const payload = request.body();
      await post.merge(payload).save();
      session.flash({ success: "Post added successfully !" });
      return response.redirect().toRoute("home");
    } catch (error) {
      return error;
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
