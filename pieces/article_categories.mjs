import { piece_names } from "../helpers/common.mjs";
import { delete_all_pieces, localize_and_publish_piece } from "./general_functions.mjs";

const article_category_functions = async() => {
    await delete_all_pieces(piece_names.articleCategory, ["en-eu"])
    await localize_and_publish_piece(piece_names.articleCategory)
    console.log("Article Categories Done")
}


export default article_category_functions;