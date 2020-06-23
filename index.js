/* const express = require("express");
const usersRouter = require("./user.router");
const mongodb=require("mongodb")
const{MongoClient}=mongodb
const MONGODB_URL="mongodb+srv://ajax:ajax1927@nodejs-4bocx.mongodb.net/test?retryWrites=true&w=majority"
const DB_NAME="db-contacts"
async function api(){
  const client=await MongoClient.connect(MONGODB_URL)
  console.log("Database connection successful")
  const db=client.db(DB_NAME)
  const contacts=db.collection("contacts") */
  /* await contacts.insertMany([
    {"name":"Allen Raymond","email":"nulla.ante@vestibul.co.uk","phone":"(992) 914-3792","subscription":"free","password":"password","token":""},
{"name":"Chaim Lewis","email":"dui.in@egetlacus.ca","phone":"(294) 840-6685","subscription":"pro","password":"password","token":""},
{"name":"Kennedy Lane","email":"mattis.Cras@nonenimMauris.net","phone":"(542) 451-7038","subscription":"free","password":"password","token":""},
{"name":"Wylie Pope","email":"est@utquamvel.net","phone":"(692) 802-2949","subscription":"pro","password":"password","token":""},
{"name":"Cyrus Jackson","email":"nibh@semsempererat.com","phone":"(501) 472-5218","subscription":"premium","password":"password","token":""},
{"name":"Abbot Franks","email":"scelerisque@magnis.org","phone":"(186) 568-3720","subscription":"premium","password":"password","token":""},
{"name":"Reuben Henry","email":"pharetra.ut@dictum.co.uk","phone":"(715) 598-5792","subscription":"premium","password":"password","token":""},
{"name":"Simon Morton","email":"dui.Fusce.diam@Donec.com","phone":"(233) 738-2360","subscription":"pro","password":"password","token":""},
{"name":"Thomas Lucas","email":"nec@Nulla.com","phone":"(704) 398-7993","subscription":"free","password":"password","token":""},
{"name":"Alec Howard","email":"Donec.elementum@scelerisquescelerisquedui.net","phone":"(748) 206-2688","subscription":"premium","password":"password","token":""}

  ]) */
 /*  console.log(await contacts.find({"name":"Chaim Lewis"}).toArray())
}
api() */
/* const PORT = 3000;

const server = express();

server.use(express.json());
server.use("/users", usersRouter);

server.use((err, req, res, next) => {
  return res.status(err.status).send(err.message);
});

server.listen(PORT, () => {
  console.log("Server started listening on port", PORT);
}); */