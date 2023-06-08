import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import PostValidator from "App/Validators/PostValidator";

export default class PostsController {
  public async index({ view, auth }: HttpContextContract) {
    //if (!auth.user) {
  //const posts = await Post.all();
     // return view.render("pages/index", { posts });
//} else {
      const user = auth.user;
      await user?.load("posts");
      const posts = user?.posts;
      return view.render("pages/index", { posts });
//}
  }

  public async create({ view }: HttpContextContract) {
    return view.render("pages/create");
  }

  public async store({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    try {
      const payload = await request.validate(PostValidator);

      await auth.user?.related("posts").create({
        title: payload.title,
        content: payload.content,
      });

      session.flash({ success: "Post added successfully !" });
      return response.redirect().toRoute("home");
    } catch (error) {
      throw error;
    }
  }

  public async show({ view, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id);
    return view.render("pages/show", { post });
  }

  public async edit({ view, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id);
    return view.render("pages/edit", { post });
  }

  public async update({
    request,
    response,
    params,
    session,
  }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      const payload = await request.validate(PostValidator);
      await post.merge({ ...payload }).save();
      session.flash({ success: "Post updated successfully !" });
      response.redirect().toRoute("home");
    } catch (error) {
      throw error;
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await post.delete();
      session.flash({ success: "Post deleted !" });
      return response.redirect().toRoute("home");
    } catch (error) {
      throw error;
    }
  }
}
