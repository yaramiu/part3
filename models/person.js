module.exports = (async function getPersonModel() {
  const mongoose = require("mongoose");

  const url = process.env.MONGODB_URI;

  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error);
  }

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
    },
    number: String,
  });

  mongoose.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  return mongoose.model("Person", personSchema);
})();
