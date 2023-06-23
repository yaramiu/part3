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
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: (phoneNumber) => {
          return phoneNumber.match(/^\d{2}\d?-\d+$/);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
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
