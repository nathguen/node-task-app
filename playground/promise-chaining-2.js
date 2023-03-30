require("dotenv").config();
require("../src/db/mongoose");

const Task = require("../src/models/task");

const _id = "642497f13ec4281942faaf6d";

const deleteTaskAndCount = async (_id) => {
  try {
    await Task.findByIdAndDelete(_id);
    const count = await Task.countDocuments({ completed: false });
    return count;
  } catch (error) {
    console.log(error);
  }
};

deleteTaskAndCount(_id)
  .then((result) => {
    console.log("incomplete tasks: ", result);
  });

