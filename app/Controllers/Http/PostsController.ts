import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"; //@ts-ignore
import Category from "App/Models/Category"; //@ts-ignore
import Post from "App/Models/Post"; //@ts-ignore
import PostValidator from "App/Validators/PostValidator";
import { string } from "@ioc:Adonis/Core/Helpers";
import Drive from "@ioc:Adonis/Core/Drive";
export default class PostsController {
  public async index({ view, auth }: HttpContextContract) {
    //if (!auth.user) {
    //const posts = await Post.all();
    // return view.render("pages/index", { posts });
    //} else {
    const user = auth.user;
    await user?.load("posts");
    const post = user?.posts[0];
    await post?.load("category");
    const posts = user?.posts;
    return view.render("pages/index", { posts });
    //}
  }

  public async create({ view }: HttpContextContract) {
    const categories = await Category.all();
    return view.render("pages/create", { categories });
  }

  public async store({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    try {
      const payload = await request.validate(PostValidator);
      const thumbnail = request.file("thumbnail");
      if (thumbnail) {
        const newName = string.generateRandom(12) + "." + thumbnail.extname;
        await thumbnail.moveToDisk("./", { name: newName });
        payload.thumbnail = newName;
        await auth.user?.related("posts").create({
          title: payload.title,
          content: payload.content,
          categoryId: payload.categoryId,
          thumbnail: payload.thumbnail,
        });
      } else {
        await auth.user?.related("posts").create({
          title: payload.title,
          content: payload.content,
          categoryId: payload.categoryId,
        });
      }
      // await auth.user?.related("posts").create({
      //   title: payload.title,
      //   content: payload.content,
      //   categoryId: payload.categoryId,
      // });

      session.flash({ success: "Post added successfully !" });
      return response.redirect().toRoute("home");
    } catch (error) {
      throw error;
    }
  }

  public async show({ view, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id);
    //const post = await Post.query().preload('category').where('id', params.id).firstOrFail();
    return view.render("pages/show", { post });
  }

  public async edit({ view, params }: HttpContextContract) {
    const post = await Post.query()
      .preload("category")
      .where("id", params.id)
      .firstOrFail();
    const categories = await Category.all();
    return view.render("pages/edit", { post, categories });
  }

  public async update({
    request,
    response,
    params,
    session,
    bouncer,
  }: HttpContextContract) {
    try {
      const post = await Post.findOrFail(params.id);
      await bouncer.authorize("editPost", post);
      const payload = await request.validate(PostValidator);
      const thumbnail = request.file("thumbnail");
      if (thumbnail) {
        if (post.thumbnail) {
          await Drive.delete(`uploads/${post.thumbnail}`);
        }
        const newName = string.generateRandom(12) + "." + thumbnail.extname;
        payload.thumbnail = newName;
      }
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
