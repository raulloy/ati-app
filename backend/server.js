const express = require('express');
const cors = require('cors');
const { getInfo } = require('./sheets.js');
const config = require('./config.js');
// const path = require('path');

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

const detailHuecos = async () => {
  const detailHueco = (await getInfo).huecosInfo;

  app.get('/api/detail-huecos/:id', (req, res) => {
    const hueco = detailHueco.filter(
      (element) => element.Producto == req.params.id
    );
    if (hueco) {
      res.send(hueco);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const accesorios = async () => {
  const detailAccesorios = (await getInfo).accesoriosInfo;

  app.get('/api/accesorios', (req, res) => {
    if (detailAccesorios) {
      res.send(detailAccesorios);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const selladoresdetailAccesorios = async () => {
  const detailAccesorio = (await getInfo).selladoresDetailInfo;

  app.get('/api/detail-accesorios/selladores/:id', (req, res) => {
    const accesorio = detailAccesorio.filter(
      (element) => element.Producto == req.params.id
    );
    if (accesorio) {
      res.send(accesorio);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  });
};

const herrajesdetailAccesorios = async () => {
  const detailAccesorio = (await getInfo).herrajesDetailInfo;

  app.get('/api/detail-accesorios/herrajes/:id', (req, res) => {
    const accesorio = detailAccesorio.filter(
      (element) =>
        element.Producto == req.params.id && element.Area == 'Producción'
    );
    if (accesorio) {
      res.send(accesorio);
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
detailHuecos();
accesorios();
selladoresdetailAccesorios();
herrajesdetailAccesorios();

// app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
// app.use(express.static(path.join(__dirname, '/../frontend')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/../frontend/index.html'));
// });

app.listen(config.PORT, () => {
  console.log(`App listening on port ${port}`);
});
