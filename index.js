require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let Person;
(async () => {
  try {
    Person = await require("./models/person");
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const createPersonToken = (object) => {
  return morgan.token("persons", function (request, response) {
    if (!object) return " ";
    return JSON.stringify(object);
  });
};
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :persons"
  )
);

app.get("/api/persons", async (request, response) => {
  createPersonToken();

  try {
    const savedPersons = await Person.find({});
    response.json(savedPersons);
  } catch (error) {
    console.error(error);
  }
});

app.get("/info", (request, response) => {
  createPersonToken();
  const currentDate = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${currentDate}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  createPersonToken();
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  createPersonToken();

  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name) {
    const nameMissingError = { error: "name missing" };
    createPersonToken(nameMissingError);
    return response.status(400).json(nameMissingError);
  } else if (!body.number) {
    const numberMissingError = { error: "number missing" };
    createPersonToken(numberMissingError);
    return response.status(400).json(numberMissingError);
  }

  const personLog = {
    name: body.name,
    number: body.number,
  };

  createPersonToken(personLog);

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
