const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const app = express();

// Use CORS middleware
app.use(cors());
const Inventory=require('./models/Inventory.jsx')
const TemporaryTable=require('./models/Temporarytable.jsx');
const mongoURI="mongodb+srv://vaishnavivijay432:TechCart%40579@cluster0.nn0brsh.mongodb.net/Customer"
// Use body-parser middleware to parse JSON
app.use(bodyParser.json());
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/addItemsToCart', async (req, res) => {
    try {
        const { cart_no, product_id } = req.body;
        console.log(cart_no, product_id);
        res.json(`${cart_no} ${product_id} Successfully inserted the Item`);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

Inventory.create([
    {
      product_id:"3E00BA0A4BC5",
      Product:'Salt',
      Price:'13',
  
    },
    {
      product_id:"3E00B9DCD18A",
      Product:'Gold Winner',
      Price:'135',
      
    },
    {
      product_id:'3E00B9869E9F',
      Product:'Sugar',
      Price:'50',
      
    },
    {
      product_id:'3E00B991B1A7',
      Product:'Surf excel',
      Price:'400',
      
    },
    {
      product_id:'3E005F8702E4',
      Product:'Salt',
      Price:'23',
      
    }
  ])
  app.get('/Inventoryitem', async (req, res) => {
    try {
      // Fetch all items from the InventoryItem collection
      const items = await Inventory.find();
  
      // Send the items in the response
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/addItemsToCart', async (req, res) => {
    const { cart_no, product_id } = req.body;
    const id = {};
    if (product_id) id.product_id = product_id;
  
    // Check if cartNumber already exists in TemporaryTable
    const existingCart = await TemporaryTable.findOne({ cartNumber: cart_no });
  
    if (existingCart) {
      // Cart exists, add items to the existing cart
      const data = await Inventory.find(id);
      
      // Update the existing entry by adding new items
      await TemporaryTable.updateOne(
        { cartNumber: cart_no },
        { $push: { items: data } }
      );
    } else {
      const data = await Inventory.find(id);
      await TemporaryTable.create({
        cartNumber: cart_no,
        items: data,
      });
    }
  
    res.json("Successfully inserted the Item");
  });


app.listen(5000, () => {
    console.log('app is running');
});
