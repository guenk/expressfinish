const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];



const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database

    .query("select * from movies where id = ?", [id])

    .then(([movies]) => {

      if (movies[0] != null) {

        res.json(movies[0]);

      } else {

        res.status(404).send("Not Found");

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error retrieving data from database");

    });

  const movie = movies.find((movie) => movie.id === id);

  if (movie != null) {
    res.json(movie);
  } else {
    res.status(404).send("Not Found");
  }
};

const database = require("./database");






const getUsers = (req, res) => {

  let sql = "select * from users";

  const sqlValues = [];


  if (req.query.language != null) {

    sql += " where language = ?";

    sqlValues.push(req.query.language);

  }

  if (req.query.city != null) {

    sql += " where city = ?";

    sqlValues.push(req.query.city);

  }


  database

    .query(sql, sqlValues)

    .then(([users]) => {

      res.status(200)
      res.json(users);

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error retrieving data from database");

    });

};

const getMovies = (req, res) => {

  const initialSql = "select * from movies";

  const where = [];


  if (req.query.color != null) {

    where.push({

      column: "color",

      value: req.query.color,

      operator: "=",

    });

  }

  if (req.query.max_duration != null) {

    where.push({

      column: "duration",

      value: req.query.max_duration,

      operator: "<=",

    });

  }



  database

    .query(

      where.reduce(

        (sql, { column, operator }, index) =>

          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,

        initialSql

      ),

      where.map(({ value }) => value)

    )

    .then(([movies]) => {

      res.json(movies);

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error retrieving data from database");

    });

};




const deleteMovie = (req, res) => {

  const id = parseInt(req.params.id);


  database

    .query("delete from movies where id = ?", [id])

    .then(([result]) => {

      if (result.affectedRows === 0) {

        res.status(404).send("Not Found");

      } else {

        res.sendStatus(204);

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error deleting the movie");

    });

};




const deleteUser = (req, res) => {

  const id = parseInt(req.params.id);


  database

    .query("delete from users where id = ?", [id])

    .then(([result]) => {

      if (result.affectedRows === 0) {

        res.status(404).send("Not Found");

      } else {

        res.sendStatus(204);

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error deleting the  user");

    });

};


























const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {

  const id = parseInt(req.params.id);

  const { title, director, year, color, duration } = req.body;


  database

    .query(

      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",

      [title, director, year, color, duration, id]

    )

    .then(([result]) => {

      if (result.affectedRows === 0) {

        res.status(404).send("Not Found");

      } else {

        res.sendStatus(204);

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error editing the movie");

    });

};



const updateUser = (req, res) => {

  const id = parseInt(req.params.id);

  const { firstname, lastname, email, city, language } = req.body;


  database

    .query(

      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",

      [firstname, lastname, email, city, language, id]

    )

    .then(([result]) => {

      if (result.affectedRows === 0) {

        res.status(404).send("Not Found");

      } else {

        res.sendStatus(204);

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error editing the user");

    });

};


const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database

    .query("select * from users where id = ?", [id])

    .then(([users]) => {

      if (users[0] != null) {

        res.json(users[0]);

      } else {

        res.status(404).send("Not Found");

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error retrieving data from database");

    });



};
module.exports = {
  getUsers,
  getUsersById,
  getMovies,
  getMovieById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser,
};

