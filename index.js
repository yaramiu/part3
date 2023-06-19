const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  createPersonToken();
  response.json(persons);
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

app.delete("/api/persons/:id", (request, response) => {
  createPersonToken();
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
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

  const isExistingName = persons.find((person) => person.name === body.name);
  if (isExistingName) {
    const nameExistsError = { error: "name exists" };
    createPersonToken(nameExistsError);
    return response.status(400).json(nameExistsError);
  }

  const person = {
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  const personLog = {
    name: body.name,
    number: body.number,
  };

  createPersonToken(personLog);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
