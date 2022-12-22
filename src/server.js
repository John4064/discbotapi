
Skip to content
DEV Community 👩‍💻👨‍💻
Create Post
5

Cover image for Build a Restful CRUD API with Node.js
    Aris Zagakos
Aris Zagakos

Posted on Oct 7, 2021 • Updated on Dec 26, 2021
Build a Restful CRUD API with Node.js
    #node
#javascript
#webdev
#tutorial
Table of Contents

What CRUD API means
Let's Start

What CRUD API means?

    The CRUD paradigm stands for the four primitive database operations that are CREATE, READ, UPDATE and DELETE.

    So, with the term CRUD API we mean, the API which have the ability to create, read, update and delete entities from a database. For this example, the entity is the employee.
    Let's Start

API Endpoints are the following
Methods 	Urls 	Description
GET 	api/employees 	Get all employees
GET 	api/employees/id 	Get a specific employee
POST 	api/employees 	Create a new employee
PUT 	api/employees/id 	Update an existing employee
DELETE 	api/employees/id 	Delete an existing employee

We create the repository and install the dependencies.
    The entry point is the server.js file.

    mkdir express-api
cd express-api
npm init
npm install express helmet morgan body-parser monk joi dotenv --save
npm install nodemon --save-dev

About the packages

express: It is a minimal and flexible Node.js web application framework.
    helmet: It helps in securing HTTP headers in express applications.
    morgan: It is an HTTP request logger middleware for Node. js
    body-parser: It is responsible for parsing the incoming request bodies.
    monk: A tiny layer that provides substantial usability improvements for MongoDB usage.
    joi: It is an object schema description language and object validator.
    dotenv: It loads environment variables from a .env file.
    nodemon: It restarts automatically the node application when file changes in the directory have been detected.

    Setup Express Web Server
    ./src/server.js

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const monk = require('monk');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

Create and configure the .env file
    ./.env
It contains all the enviroment variables that we use.
    TEST_DB_URL variable is for test cases in order to prevent the insertion of test data in the database. Also, you can specify the port number you want.

    DB_URL = localhost/my-employees
TEST_DB_URL = localhost/test-my-employees
PORT = 5000

    ./src/db/schema.js
Create the data schema and define the validation rules that the properties name and job have to follow.

    const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    job: Joi.string()
        .min(3)
        .max(30)
        .required(),
})

module.exports = schema;

./src/db/connection.js
Connect to the database

const monk = require('monk');

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === 'test') {
    dbUrl = process.env.TEST_DB_URL;
}

const db = monk(dbUrl);

module.exports = db;

./src/middlewares/index.js
Create the error middleware to handle the errors and give properly responses.

    function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found', req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next){
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

module.exports = {
    notFound,
    errorHandler
}

We import ./src/db/connection.js, ./src/db/schema.js and ./src/middlewares/index.js files in ./src/server.js

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config();

const schema = require('./db/schema');
const db = require('./db/connection');
const employees = db.get('employees');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

Now, we code the API Endpoints

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config();

const schema = require('./db/schema');
const db = require('./db/connection');
const employees = db.get('employees');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

/* Get all employees */
app.get('/', async (req, res, next) => {
    try {
        const allEmployees = await employees.find({});
        res.json(allEmployees);
    } catch(error) {
        next(error);
    }
});

/* Get a specific employee */
app.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id
        });

        if(!employee) {
            const error = new Error('Employee does not exist');
            return next(error);
        }

        res.json(employee);
    } catch(error) {
        next(error);
    }
});

/* Create a new employee */
app.post('/', async (req, res, next) => {
    try {
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });

        const employee = await employees.findOne({
            name,
        })

        // Employee already exists
        if (employee) {
            res.status(409); // conflict error
            const error = new Error('Employee already exists');
            return next(error);
        }

        const newuser = await employees.insert({
            name,
            job,
        });

        console.log('New employee has been created');
        res.status(201).json(newuser);
    } catch(error) {
        next(error);
    }
});

/* Update a specific employee */
app.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });
        const employee = await employees.findOne({
            _id: id
        });

        // Employee does not exist
        if(!employee) {
            return next();
        }

        const updatedEmployee = await employees.update({
                _id: id,
            }, {
                $set: result},
            { upsert: true }
        );

        res.json(updatedEmployee);
    } catch(error) {
        next(error);
    }
});

/* Delete a specific employee */
app.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id
        });

        // Employee does not exist
        if(!employee) {
            return next();
        }
        await employees.remove({
            _id: id
        });

        res.json({
            message: 'Success'
        });

    } catch(error) {
        next(error);
    }
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

We go to the package.json file and replace the script section with the following

"scripts": {
    "start": "node src/server.js",
        "dev": "nodemon src/server.js"
},

The command npm start starts the Node.js application and the command npm run dev starts the Node.js application with the only difference that any change we do, will automatically be monitored by nodemon.

    We "split" the ./src/server.js and create the ./src/app.js file.

    ./src/app.js

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config();

const schema = require('./db/schema');
const db = require('./db/connection');
const employees = db.get('employees');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

/* Get all employees */
app.get('/', async (req, res, next) => {
    try {
        const allEmployees = await employees.find({});
        res.json(allEmployees);
    } catch(error) {
        next(error);
    }
});

/* Get a specific employee */
app.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id
        });

        if(!employee) {
            const error = new Error('Employee does not exist');
            return next(error);
        }

        res.json(employee);
    } catch(error) {
        next(error);
    }
});

/* Create a new employee */
app.post('/', async (req, res, next) => {
    try {
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });

        const employee = await employees.findOne({
            name,
        })

        // Employee already exists
        if (employee) {
            res.status(409); // conflict error
            const error = new Error('Employee already exists');
            return next(error);
        }

        const newuser = await employees.insert({
            name,
            job,
        });

        console.log('New employee has been created');
        res.status(201).json(newuser);
    } catch(error) {
        next(error);
    }
});

/* Update a specific employee */
app.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });
        const employee = await employees.findOne({
            _id: id
        });

        // Employee does not exist
        if(!employee) {
            return next();
        }

        const updatedEmployee = await employees.update({
                _id: id,
            }, {
                $set: result},
            { upsert: true }
        );

        res.json(updatedEmployee);
    } catch(error) {
        next(error);
    }
});

/* Delete a specific employee */
app.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id
        });

        // Employee does not exist
        if(!employee) {
            return next();
        }
        await employees.remove({
            _id: id
        });

        res.json({
            message: 'Success'
        });

    } catch(error) {
        next(error);
    }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

./src/server.js

const app = require('./app');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

Last step is to refactor our code and create ./src/routes/employees.

    ./src/routes/employees.js

const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

const employees = db.get('employees');

const router = express.Router();

/* Get all employees */
router.get('/', async (req, res, next) => {
    try {
        const allEmployees = await employees.find({});
        res.json(allEmployees);
    } catch (error) {
        next(error);
    }
});

/* Get a specific employee */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id,
        });

        if (!employee) {
            const error = new Error('Employee does not exist');
            return next(error);
        }

        res.json(employee);
    } catch (error) {
        next(error);
    }
});

/* Create a new employee */
router.post('/', async (req, res, next) => {
    try {
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });

        const employee = await employees.findOne({
            name,
        });

        // Employee already exists
        if (employee) {
            const error = new Error('Employee already exists');
            res.status(409); // conflict error
            return next(error);
        }

        const newuser = await employees.insert({
            name,
            job,
        });

        res.status(201).json(newuser);
    } catch (error) {
        next(error);
    }
});

/* Update a specific employee */
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });
        const employee = await employees.findOne({
            _id: id,
        });

        // Employee does not exist
        if (!employee) {
            return next();
        }

        const updatedEmployee = await employees.update({
                _id: id,
            }, { $set: result },
            { upsert: true });

        res.json(updatedEmployee);
    } catch (error) {
        next(error);
    }
});

/* Delete a specific employee */
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employees.findOne({
            _id: id,
        });

        // Employee does not exist
        if (!employee) {
            return next();
        }
        await employees.remove({
            _id: id,
        });

        res.json({
            message: 'Employee has been deleted',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

and the ./src/app.js file looks like this

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

const app = express();

require('dotenv').config();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const employees = require('./routes/employees');

app.use('/api/employees', employees);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

You can check the whole project in my github repository express-api
Top comments (5)
pic

sabbirsobhani profile image
•
Dec 2 '21

I have a question. Can we make a CRUD or RESTful API using only core Nodejs?
    Reply

    zagaris profile image
•
Dec 2 '21

Hi Sabbir. Sure, you can use NodeJS core HTTP built-in module and create a web server, instead of using express or any other framework.
    Reply

sabbirsobhani profile image
•
Dec 3 '21

Thank You, Aris.
    Reply

juanfabiorey profile image
•
Oct 9 '21

Oh great, and high detailed. Thanks.
    Reply

mhenrk profile image
•
Oct 9 '21

This is amazing.. I was trying to understand api concepts and you teach me much more than I wish
Reply
Code of Conduct • Report abuse
What image format should you use in your next project? 🤔

Read next
daviducolo profile image
Metaprogramming with Ruby

    Davide Santangelo - Dec 19
mbogan profile image
Salesforce Functions with Heroku Postgres

Michael Bogan - Dec 19
abhinav0334 profile image
10 Most-Liked Programming Languages that Humans Will Use in 2050

Abhinav Srivastava - Dec 19
marcosteinke profile image
Brief summary of ChatGPT

Marco Steinke - Dec 20
Aris Zagakos
<script>alert('Welcome');</script>

Location
Greece
Education
Computer Science, University of Crete
Work
Software Engineer at Blueground
Joined
Aug 27, 2020

More from Aris Zagakos
Implement JavaScript Array Methods From Scratch
#javascript #webdev #beginners
An Introduction to Flexbox
#html #css #webdev #beginners
Understanding CSS Media Queries
#html #css #webdev #beginners

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const monk = require('monk');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

DEV Community 👩‍💻👨‍💻 — A constructive and inclusive social network for software developers. With you every step of your journey.

    Built on Forem — the open source software that powers DEV and other inclusive communities.

    Made with love and Ruby on Rails. DEV Community 👩‍💻👨‍💻 © 2016 - 2022.
