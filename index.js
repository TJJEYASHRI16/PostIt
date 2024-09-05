import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Items",
  password: "root",
  port: 5432,
});
db.connect();

let items = [
    
];

async function getItems(){
  
  const result = await db.query("select * from items");
  items=result.rows;
  
  return items;
}

app.get("/", async (req, res) => {
  const items= await getItems()
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    const result =await db.query(
      "INSERT INTO items (title) VALUES ($1) returning *",
      [item] 
    );
    const id = result.rows[0].id;
    items.push({id:id, title: item });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
 
 
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  try {
    const result =await db.query(
      "update items set title = $1 where id = $2 returning * ",
      [itemTitle,itemId] 
    );
    // const id = result.rows[0].id;
    // items.push({id:id, title: itemTitle });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
 
});

app.post("/delete",async (req, res) => {
const itemId=req.body.deleteItemId;
try {
  const result =await db.query(
    "delete from items where id = $1  ",
    [itemId] 
  );
  // const id = result.rows[0].id;
  // items.push({id:id, title: itemTitle });
  res.redirect("/");
} catch (err) {
  console.log(err);
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
