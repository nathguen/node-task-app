require('dotenv').config();
require("../src/db/mongoose");

const User = require("../src/models/user");

const _id = "64248518c94c6229a008aa31";

const updateUser = async (_id, age) => {
  try {
    const user = await User.findByIdAndUpdate(_id, { age });
    const count = await User.countDocuments({ age: 16 });

    console.log({ user, count })
  } catch (error) {
    console.log(error);
  }
};

updateUser(_id, 12);