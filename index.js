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

app.get("/api/persons", async (request, response, next) => {
  createPersonToken();

  try {
    const savedPersons = await Person.find({});
    response.json(savedPersons);
  } catch (error) {
    next(error);
  }
});

app.get("/info", async (request, response, next) => {
  createPersonToken();

  const currentDate = new Date();
  try {
    const persons = await Person.find({});
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${currentDate}</p>`);
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  createPersonToken();

  try {
    const searchedPerson = await Person.findById(request.params.id);
    if (searchedPerson) {
      response.json(searchedPerson);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  createPersonToken();

  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
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
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true }
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
