import { piece_names } from "../helpers/common.mjs";
import { delete_all_pieces, localize_and_publish_piece } from "./general_functions.mjs";

const author_functions = async() => {
    await delete_all_pieces(piece_names.author, ["en-eu"])
    await localize_and_publish_piece(piece_names.author)
}


export default author_functions;