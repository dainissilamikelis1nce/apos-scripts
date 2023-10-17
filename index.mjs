
import { login } from "./helpers/api.mjs";
import { get_supported_languages, upload_file } from "./phrase/index.mjs";
import article_category_functions from "./pieces/article_categories.mjs";
import article_tag_functions from "./pieces/article_tags.mjs";
import articles_functions from "./pieces/articles.mjs";
import author_functions from "./pieces/authors.mjs";
import blog_functions from "./pieces/blogs.mjs";

// this should be automated
// this should be done once when the token dies
// const token = await login();
// debugger;

// await article_tag_functions();
// await article_category_functions();

//await articles_functions();
// await author_functions();
// await blog_functions();

await upload_file();

