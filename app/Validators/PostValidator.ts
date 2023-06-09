import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'//@ts-ignore
import Category from 'App/Models/Category'

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string({trim:true}, [rules.minLength(5), rules.unique({table: 'posts', column:'title'})]),
    content: schema.string({trim:true}, [rules.minLength(20)]),
categoryId: schema.number([rules.exists({table: 'categories', column: Category.primaryKey})]),
thumbnail: schema.file.optional({size:'2mb', extnames:['jpg', 'png', 'jpeg']})
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'title.minLength' : 'The title must be at least 5 characters',
    'title.unique' : 'Another post has the same title',
    'content.minLength' : 'The content must be at least 20 characters',
    'thumbnail.extnames' : 'The thumbnail must be a jpg/png/jpeg file and under 2mb'
  }
}
