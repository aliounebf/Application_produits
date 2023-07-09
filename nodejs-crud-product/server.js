const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données MongoDB Atlas
mongoose.connect('mongodb+srv://aliounebadarafall01:motsdepasse123@alioune98.qvytr1k.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Erreur lors de la connexion à MongoDB Atlas', err);
  });

// Définition du modèle Product
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  warranty_years: {
    type: Number,
  },
  available: {
    type: Boolean,
  },
});

const Product = mongoose.model('Product', ProductSchema);

// Middleware pour le parsing du corps des requêtes en JSON
app.use(express.json());

// Endpoint pour récupérer tous les produits
app.get('/products', (req, res) => {
  Product.find()
    .then((products) => {
      res.send({ data: products });
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des produits', err);
      res.status(500).send('Erreur lors de la récupération des produits');
    });
});

// Endpoint pour créer un produit
app.post('/products', (req, res) => {
  const {name, type,price,rating,warranty_years,available } = req.body;

  const product = new Product({ name, type,price,rating,warranty_years,available });

  product.save()
    .then((savedProduct) => {
      res.status(201).send({ data: savedProduct });
    })
    .catch((err) => {
      console.error('Erreur lors de la création du produit', err);
      res.status(500).send('Erreur lors de la création du produit');
    });
});

// Endpoint pour récupérer un produit par son ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.status(404).send('Produit non trouvé');
      } else {
        res.send({ data: product });
      }
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération du produit', err);
      res.status(500).send('Erreur lors de la récupération du produit');
    });
});

// Endpoint pour mettre à jour un produit
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const {name, type,price,rating,warranty_years,available } = req.body;

  Product.findByIdAndUpdate(productId, {name, type,price,rating,warranty_years,available }, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        res.status(404).send('Produit non trouvé');
      } else {
        res.send({ data: updatedProduct });
      }
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du produit', err);
      res.status(500).send('Erreur lors de la mise à jour du produit');
    });
});

// Endpoint pour supprimer un produit
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;

  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        res.status(404).send('Produit non trouvé');
      } else {
        res.send({ data: deletedProduct });
      }
    })
    .catch((err) => {
      console.error('Erreur lors de la suppression du produit', err);
      res.status(500).send('Erreur lors de la suppression du produit');
    });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
