// Importera Express-modulen
let express = require("express"); // INSTALLERA MED "npm install express" I KOMMANDOTOLKEN
// Skapa en Express-app
let app = express();

// Lyssna på port 4000 för inkommande förfrågningar
app.listen(4000);
console.log("Servern körs på port 4000");

// Importera MySQL-modulen för att hantera databasanslutning
const mysql = require("mysql"); // INSTALLERA MED "npm install mysql" I KOMMANDOTOLKEN
// Skapa en anslutning till MySQL-databasen med specifika anslutningsuppgifter
con = mysql.createConnection({
  host: "localhost", // databas-serverns IP-adress
  user: "root", // standardanvändarnamn för XAMPP
  password: "", // standardlösenord för XAMPP
  database: "jensen2023", // ÄNDRA TILL NAMN PÅ ER EGEN DATABAS
  multipleStatements: true, // OBS: måste tillåta att vi kör flera sql-anrop i samma query
});

// Använd inbyggd Express-middleware för att hantera JSON-data i förfrågningar och svar
app.use(express.json()); // för att läsa data från klient och för att skicka svar (ersätter bodyparser som vi använt någon gång tidigare)


app.get("/", function (req, res) {                                // Hantera en GET-förfrågan till rotadressen genom att skicka en HTML-fil
  res.sendFile(__dirname + "/dokumentation.html");
});


const COLUMNS =["id", "username", "password", "name", "email"];   // Skapa en array med kolumnnamn för användning senare i koden

app.get("/users", function (req, res) {                           // Kontrollera autentisering med token i header
  let authHeader = req.headers["authorization"];
  if (authHeader === undefined) {
    // skicka lämplig HTTP-status om auth-header saknas, en “400 någonting”
    res.sendStatus(400);                                          // Skicka "Bad request" om autentisering saknas
    return;
  }
  let token = authHeader.slice(7);                                // tar bort "BEARER " från headern. Extrahera token från headern
  // nu finns den inskickade token i variabeln token
  console.log(token);

  
  let decoded;                                                    // Avkoda token för autentisering
  try {
    decoded = jwt.verify(token, "EnHemlighetSomIngenKanGissaXyz123%&/");
  } catch (err) {
    console.log(err);                                             //Logga felet, för felsökning på servern.
    res.status(401).send("Invalid auth token");                   // Skicka felmeddelande för ogiltig token
    return;
  }

  //Här kan man göra något bra med den info som finns i decoded...
  console.log(decoded);
  console.log(`Tjena ${decoded.name}! Din mailadress är ${decoded.email}.`);
  // Hämta användarinformation från databasen
  let sql = "SELECT * FROM users"; // ÄNDRA TILL NAMN PÅ ER EGEN TABELL (om den heter något annat än "users"). ÄNDRA TILL ER EGEN TABELL
  console.log(sql);
  // skicka query till databasen
  con.query(sql, function (err, result, fields) {
    res.send(result);                                             // Skicka databassvaret till klienten
  });
});


// Hantera GET-förfrågningar till "/users/:id" för att filtrera efter användar-ID
// route-parameter, dvs. filtrera efter ID i URL:en
app.get("/users/:id", function (req, res) {
  // Värdet på id ligger i req.params
  let sql = "SELECT * FROM users WHERE id=" + req.params.id;      // Hämta användaren med specificerat ID från databasen
  console.log(sql);
  // skicka query till databasen
  con.query(sql, function (err, result, fields) {
    if (result.length > 0) {
      res.send(result);                                           // Skicka användarinformationen om den finns
    } else {
      res.sendStatus(404);                                        // Skicka 404=not found om användaren inte hittas
    }
  });
});

// Funktion för att skapa ett WHERE-villkor utifrån query-parametrar
let createCondition = function (query) {
    // skapar ett WHERE-villkor utifrån query-parametrar
    console.log(query);
    let output = " WHERE ";
    for (let key in query) {
      if (COLUMNS.includes(key)) {
        // om vi har ett kolumnnamn i vårt query
        output += `${key}="${query[key]}" OR `;                   // Skapar ett filter utifrån kolumnnamn och värden i query
      }
    }
    if (output.length == 7) {
      // " WHERE "
      return "";                                                  // Returnera en tom sträng om query är tomt eller irrelevant för vår databastabell
    } else {
      return output.substring(0, output.length - 4);              // ta bort sista " OR "
    }
  };
// från övning 5
// Hantera PUT-förfrågningar till "/users/:id" för att uppdatera användarinformation
  app.put("/users/:id", function (req, res) {
    //kod här för att hantera anrop…
    // kolla först att all data som ska finnas finns i request-body
    if (!(req.body && req.body.name && req.body.email && req.body.password)) {
      // om data saknas i body
      res.sendStatus(400);                                        // Skicka felstatus om viss data saknas i request-body
      return;
    }
    let sql = `UPDATE users 
          SET name = '${req.body.name}', email = '${req.body.email}', password = '${hash(req.body.password)}',
          WHERE id = ${req.params.id}`;                           // Uppdatera användarinformationen baserat på ID
  
    con.query(sql, function (err, result, fields) {
      if (err) {
        throw err;                                                // Kasta ett fel vid felhantering
        //kod här för felhantering, skicka felmeddelande osv.
      } else {
        // meddela klienten att request har processats OK
        res.sendStatus(200);                                      // Skicka status 200=OK efter lyckad uppdatering
      }
    });
  });

  // från övn 6 punkt 1
  const crypto = require("crypto");                               //INSTALLERA MED "npm install crypto" I KOMMANDOTOLKEN
  // Funktion för att skapa hash av lösenord
  function hash(data) {
    const hash = crypto.createHash("sha256");                     // Skapar en SHA-256 hashfunktion
    hash.update(data);                                            // Uppdaterar hashen med lösenordsdatan
    return hash.digest("hex");                                    // Returnerar hashen i hexadecimalt format
  }
  

  // samma som i tidigare exempel (hantera POST och skriva till databas), men med hashat lösenord
  // Hantera POST-förfrågningar till "/users" för att skapa nya användare med hashade lösenord
  app.post("/users", function (req, res) {
    if (!req.body.username) {
      res.status(400).send("username required!");                 // Skicka felmeddelande om användarnamn saknas
      return;
    }
    let fields = ["name", "password", "email", "username"];       // Kolumnnamn för användaruppgifter. Ändra eventuellt till namn på er egen databastabells kolumner
    for (let key in req.body) {
      if (!fields.includes(key)) {
        res.status(400).send("Unknown field: " + key);            // Skicka felmeddelande om okänd data skickas
        return;
      }
    }
    // OBS: näst sista raden i SQL-satsen står det hash(req.body.passwd) istället för req.body.passwd
    // Det hashade lösenordet kan ha över 50 tecken, så använd t.ex. typen VARCHAR(100) i databasen, annars riskerar det hashade lösenordet att trunkeras (klippas av i slutet)
    // Skapa en SQL-query för att lägga till en ny användare med hashat lösenord
    let sql = `INSERT INTO users (username, email, name, password)
      VALUES ('${req.body.username}', 
      '${req.body.email}',
      '${req.body.name}',
      '${hash(req.body.password)}');
      SELECT LAST_INSERT_ID();`;    // OBS! hash(req.body.password) i raden ovan! Använd hashat lösenord i SQL-queryn
    console.log(sql);
  
    // Utför SQL-queryn för att lägga till användaren i databasen
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      let output = {
        id: result[0].insertId,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      }; // OBS: bäst att INTE returnera lösenordet               // Skicka tillbaka användaruppgifterna för den nya användaren
      res.send(output);
    });
  });
  
  // från övn 7 punkt 1 och 2
  const jwt = require("jsonwebtoken");                            // Lägga till jsonwebtoken för att hantera autentisering
  
  // Hantera POST-förfrågningar till "/login" för att logga in och skapa en JWT-token
  app.post("/login", function (req, res) {
    //kod här för att hantera anrop…
    let sql = `SELECT * FROM users WHERE username='${req.body.username}'`;  // Hämta användaren från databasen med användarnamnet
  
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (result.length == 0) {
        res.sendStatus(401);                                      // Skicka 401 om användaren inte finns
        return;
      }
      let passwordHash = hash(req.body.password);                 // Skapa en hash av det inskickade lösenordet
      console.log(passwordHash);
      console.log(result[0].password);
      if (result[0].password == passwordHash) {
        //Denna kod skapar en token att returnera till anroparen.
      let payload = {
        sub: result[0].username, //sub är obligatorisk            // Användarnamn som token-subjekt (sub)
        name: result[0].name, //Valbar information om användaren  // Användarens namn
        email: result[0].email,
      };
      let token = jwt.sign(payload, "EnHemlighetSomIngenKanGissaXyz123%&/");
      res.json(token);                                            // Returnera token till klienten

      } else {
        res.sendStatus(401);                                      // Skicka 401 om lösenordet inte matchar
      }
    });
  });

  // Hantera GET-förfrågningar till "/users" för att hämta användarinformation efter autentisering
  app.get("/users", function (req, res) {
    let authHeader = req.headers["authorization"];
    if (authHeader === undefined) {
      // skicka lämplig HTTP-status om auth-header saknas, en “400 någonting”
      res.sendStatus(400);                                        // "Bad request". Skicka felstatus om autentiseringssättet saknas
      return;
    }
    let token = authHeader.slice(7);                              // tar bort "BEARER " från headern. Extrahera token från headern
    // nu finns den inskickade token i variabeln token
    console.log(token);
  
    // Avkoda token och hämta användarinformation
    let decoded;
    try {
      decoded = jwt.verify(token, "EnHemlighetSomIngenKanGissaXyz123%&/");   // Verifiera token
    } catch (err) {
      console.log(err); //Logga felet, för felsökning på servern.
      res.status(401).send("Invalid auth token");                 // Skicka felmeddelande om token ogiltig
      return;
    }
  
    //Här kan man göra något bra med den info som finns i decoded...
    console.log(decoded);
    console.log(`Tjena ${decoded.name}! Din mailadress är ${decoded.email}.`);
    // ... men just nu nöjer vi oss bara att läsa från databasen.
    let sql = "SELECT * FROM users"; // ÄNDRA TILL NAMN PÅ ER EGEN TABELL (om den heter något annat än "users") // Hämta alla användare från databasen
    console.log(sql);

    // Skicka query till databasen för att hämta användarinformation
    con.query(sql, function (err, result, fields) {
      res.send(result);                                             // Skicka tillbaka användarinformationen
    });
  });
  
