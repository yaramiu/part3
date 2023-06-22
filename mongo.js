const mongoose = require("mongoose");

async function saveOrGetDataFromMongoDB() {
  if (process.argv.length < 3) {
    console.log("node mongo.js <password> [name] [number]");
  }

  const password = process.argv[2];

  const url = `mongodb+srv://fullstack:${password}@cluster0.8oocm9l.mongodb.net/phonebook?retryWrites=true&w=majority`;

  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error(error);
  }

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  if (process.argv.length === 3) {
    try {
      const result = await Person.find({});
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  } else {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    try {
      const result = await person.save();
      console.log(result);
      console.log(`added ${person.name} number ${person.number} to phonebook`);
    } catch (error) {
      console.log(error);
    }
  }

  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

saveOrGetDataFromMongoDB();
