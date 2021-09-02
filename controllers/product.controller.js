const db = require('../models');
const Product = db.Products;

// Create and Save a new Product
exports.create = (req, res) => {
  if (!req.body.title || !req.body.description) {
    res.status(400).send({ message: 'Products can not be empty!' })
  }

  const products = new Product({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  products
    .save(products)
    .then(data => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || 'Something went wrong.'
      });
    });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Product.find(condition)
    .then(data => {
      if (!data.length) {
        res.status(404).send({
          message: 'No record found'
        })
      } else {
        res.send(data);
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || 'Something went wrong.'
      });
    });
};

// Find all published Products
exports.findAllPublished = (req, res) => {
  Product.find({ published: true })
    .then(data => {
      if (!data.length) {
        res.status(404).send({
          message: 'No record found'
        })
      } else {
        res.send(data);
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || 'Something went wrong.'
      });
    });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Not Product Found with id=${id}`
        })
      } else {
        res.send(data);
      }
    })
    .catch(error => {
      res.status(500).send({ 
        message: `Error retrieving Product with id=${id}`
      });
    });
};

// Update a Product with id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
       message: 'Data to update can not be empty!' })
  }

  const id = req.params.id;

  Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Product with id=${id}. Product was not found!`
        })
      } else {
        res.send({ message: 'Product was updated successfully.' })
      }
    })
    .catch(error => {
      res.status(500).send({
        message: `Error updating Product with id=${id}`
      });
    });
};

// Delete a Product with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.findByIdAndRemove(id)
  .then(data => {
    if(!data) {
      res.status(404).send({
        message: `Cannot delete Product with id=${id}. Product was not found!`
      })
    } else {
      res.send({ message: 'Product deleted successfully!' })
    }
  })
  .catch(error => {
    res.status(500).send({
      message: `Error deleting Product with id=${id}`
    });
  });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {

  Product.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Products were deleted successfully!`
    });
  })
  .catch(error => {
    res.status(500).send({
      message: err.message || 'Something went wrong'
    });
  });
};

