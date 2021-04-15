const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    name: "Arto Hellas",
    number: "8000",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 5,
  },
  {
    name: "Albert Einstein",
    number: "700",
    id: 6,
  },
  {
    name: "tim b",
    number: "100",
    id: 8,
  },
  {
    name: "tim f",
    number: "100",
    id: 12,
  },
  {
    name: "tim h",
    number: "100",
    id: 13,
  },
];
app.get("/", (request, response) => {
  response.send("<h1>Hello Jim!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>  
  <p>${new Date()}</p>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const id = Math.floor(100000 * Math.random());
  return id;
};

app.post("/api/persons", (request, response, morgan) => {
  const body = request.body;
  let namesInList = persons.map((pe) => pe.name);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  } else if (namesInList.includes(body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);

  morgan(JSON.stringify(person));
  response.json(person);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
