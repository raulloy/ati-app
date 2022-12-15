const express = require('express');
const cors = require('cors');
const { getInfo } = require('./sheets.js');
const app = express();
const port = 5000;

app.use(cors());

const paginatedResults = (model) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    results.length = model.length;
    results.limit = limit;
    results.results = model.slice(startIndex, endIndex);
    res.paginatedResults = results;
    next();
  };
};

const productsInfo = async () => {
  const products = (await getInfo).productsInfo;

  app.get('/api/products', paginatedResults(products), (req, res) => {
    // console.log(res.paginatedResults);
    if (res.paginatedResults) {
      res.send(res.paginatedResults);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const quotationsInfo = async () => {
  const quotations = (await getInfo).quotationsInfo;

  app.get('/api/quotations/:id', (req, res) => {
    const quotation = quotations.find((element) => element.ID == req.params.id);
    if (quotation) {
      res.send(quotation);
    } else {
      res.status(404).send({ message: 'Quotation not found!' });
    }
  });
};

const detailProducts = async () => {
  const detailProduct = (await getInfo).quotesDetailInfo;

  app.get('/api/detail/:id', (req, res) => {
    const product = detailProduct.find(
      (element) => element.ID == req.params.id
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const detailInfo = async () => {
  const detail = (await getInfo).quotesDetailInfo;

  app.get('/api/detail', paginatedResults(detail), (req, res) => {
    // console.log(res.paginatedResults);
    if (res.paginatedResults) {
      res.send(res.paginatedResults);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const detailPerfiles = async () => {
  const detailPerfil = (await getInfo).perfilesDetailInfo;

  app.get('/api/detail-perfiles/:id', (req, res) => {
    const perfil = detailPerfil.filter(
      (element) => element.Producto == req.params.id
    );
    if (perfil) {
      res.send(perfil);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

// const perfiles = async () => {
//   const detailPerfil = (await getInfo).perfilesInfo;

//   app.get('/api/perfiles/:id', (req, res) => {
//     const perfil = detailPerfil.filter(
//       (element) => element.Codigo == req.params.id
//     );
//     if (perfil) {
//       res.send(perfil);
//     } else {
//       res.status(404).send({ message: 'Product not found!' });
//     }
//   });
// };
const perfiles = async () => {
  const detailPerfil = (await getInfo).perfilesInfo;

  app.get('/api/perfiles', (req, res) => {
    if (detailPerfil) {
      res.send(detailPerfil);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

productsInfo();
quotationsInfo();
detailProducts();
detailInfo();
detailPerfiles();
perfiles();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
