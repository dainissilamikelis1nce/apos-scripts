import { piece_names } from "../helpers/common.mjs";
import { delete_all_pieces, localize_and_publish_piece } from "./general_functions.mjs";

const article_tag_functions = async() => {
    await delete_all_pieces(piece_names.articleTag, ["en-eu"])
    await localize_and_publish_piece(piece_names.articleTag)
    console.log("Article TAGS done")
}


export default article_tag_functions;