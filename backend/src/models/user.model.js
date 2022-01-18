const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const artistSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, required: true }],
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "albums",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

artistSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = bcryptjs.hashSync(this.password, 8);
  this.password = hash;
  return next();
});

artistSchema.methods.checkPassword = function (password) {
  const match = bcryptjs.compareSync(password, this.password);

  return match;
};

const Artist = mongoose.model("artists", artistSchema);

module.exports = Artist;
