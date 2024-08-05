const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const express = require("express")
const app = express();
const PORT = 3000;

app.use(express.json());

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true
    },
})
const User = mongoose.model("User", userSchema)


// get user
app.get("/users/:id", async (req, res) => {
    try {
        let id = req.params.id
        let foundUser = await User.findById(id)
        if (!foundUser) {
            res.status(404).send("user not found")
        }
        res.status(200).send(foundUser)
    } catch (error) {
        console.log("error" + error)
        res.status(400).send(error)
    }
});



// creating a user
app.post("/users", async (req, res) => {
    try {
        const { username, password } = req.body;
        let hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, hashedPassword })
        await newUser.save();
        res.status(201).send(newUser)
    } catch (error) {
        console.log("error:" + error);
        res.status(400).send(error)
    }
});

// put route
router.put("/users/:id", async (req, res) => {

    try {
  const { id } = req.params;
   const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findByIdAndUpdate(id, { username, password: hashedPassword }, { new: true });
  res.status(200).json(updatedUser);
   } catch (error) {
   res.status(500).json({ error: error.message });
   }
  
  });

  // delete route

  router.delete("/users/:id", async (req, res) => {

    try {
  const { id } = req.params;
   await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully" });
   } catch (error) {
  res.status(500).json({ error: error.message });
    }
  
  });

const uri = "mongodb+srv://mharton411:Colorcodedlab7@cluster0.hqhdjzf.mongodb.net/" ;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectDb() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
        console.log("error: " + error);
    }
}

app.listen(PORT, async () => {
    await connectDb().catch(console.dir);
    console.log(`Express API at: localhost:${PORT}`)
})