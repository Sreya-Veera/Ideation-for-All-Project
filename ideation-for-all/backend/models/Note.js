const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
    boardId: String,
    text: String,
    x: Number, y: Number,
    groupId: { type: String, default: null},
    votes: { type: Number, default: 0},

})
module.exports = mongoose.model("note", noteSchema);

