const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require('./config');

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(config.doc_ID);

const getInfo = async () => {
  // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: config.client_email,
    private_key: config.private_key.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title, '- ATI DataBase');

  const productsSheet = doc.sheetsByTitle['Productos']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const productsInfo = await productsSheet.getRows(); // can pass in { limit, offset }
  const productRows = productsInfo.map((element) => element._rawData);

  const productsObj = productRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const products = productsObj.map(
    ({ 0: Codigo, 1: Fabricante, 2: Descripcion, 3: Serie }) => ({
      Codigo,
      Fabricante,
      Descripcion,
      Serie,
    })
  );

  const quotationsSheet = doc.sheetsByTitle['Cotizaciones']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const quotationsInfo = await quotationsSheet.getRows(); // can pass in { limit, offset }
  const quotationsRows = quotationsInfo.map((element) => element._rawData);

  const quotationsObj = quotationsRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const quotations = quotationsObj.map(
    ({ 0: ID, 6: No_Proyecto, 7: No_Cotizacion }) => ({
      ID,
      No_Proyecto,
      No_Cotizacion,
    })
  );

  const quotesDetailSheet = doc.sheetsByTitle['Detalle']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const quotesDetailInfo = await quotesDetailSheet.getRows(); // can pass in { limit, offset }
  const quotesDetailRows = quotesDetailInfo.map((element) => element._rawData);

  const detailObj = quotesDetailRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const quotesDetail = detailObj.map(
    ({
      0: ID,
      1: ID_Cotizacion,
      2: Ubicacion,
      4: Tipo,
      5: Codigo,
      6: Descripcion,
      8: Unidad,
      10: Alto,
      11: Ancho,
      12: Referencia,
      29: Importe,
    }) => ({
      ID,
      ID_Cotizacion,
      Ubicacion,
      Tipo,
      Codigo,
      Descripcion,
      Unidad,
      Alto,
      Ancho,
      Referencia,
      Importe,
    })
  );

  const perfilesDetailSheet = doc.sheetsByTitle['Detalle Perfiles'];
  const perfilesDetailInfo = await perfilesDetailSheet.getRows();
  const perfilesDetailRows = perfilesDetailInfo.map(
    (element) => element._rawData
  );

  const perfilesdetailObj = perfilesDetailRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const perfilesDetail = perfilesdetailObj.map(
    ({ 1: Producto, 2: Perfil, 3: Cantidad, 6: Formula }) => ({
      Producto,
      Perfil,
      Cantidad,
      Formula,
    })
  );

  const perfilesSheet = doc.sheetsByTitle['Perfiles'];
  const perfilesInfo = await perfilesSheet.getRows();
  const perfilesRows = perfilesInfo.map((element) => element._rawData);

  const perfilesObj = perfilesRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const perfiles = perfilesObj.map(
    ({ 0: Codigo, 1: Descripcion, 4: Serie }) => ({
      Codigo,
      Descripcion,
      Serie,
    })
  );

  const huecosDetailSheet = doc.sheetsByTitle['Detalle Huecos'];
  const huecosDetailInfo = await huecosDetailSheet.getRows();
  const huecosDetailRows = huecosDetailInfo.map((element) => element._rawData);

  const huecosdetailObj = huecosDetailRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const huecosDetail = huecosdetailObj.map(
    ({
      1: Producto,
      2: Hueco,
      3: Cantidad,
      4: Formula_Alto,
      5: Formula_Ancho,
    }) => ({
      Producto,
      Hueco,
      Cantidad,
      Formula_Alto,
      Formula_Ancho,
    })
  );

  const accesoriosSheet = doc.sheetsByTitle['Accesorios'];
  const accesoriosInfo = await accesoriosSheet.getRows();
  const accesoriosRows = accesoriosInfo.map((element) => element._rawData);

  const accesoriosObj = accesoriosRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const accesorios = accesoriosObj.map(
    ({ 0: Cod, 1: Nombre, 2: Proveedor, 3: Familia, 4: Serie }) => ({
      Cod,
      Nombre,
      Proveedor,
      Familia,
      Serie,
    })
  );

  const selladoresDetailSheet = doc.sheetsByTitle['Detalle Selladores'];
  const selladoresDetailInfo = await selladoresDetailSheet.getRows();
  const selladoresDetailRows = selladoresDetailInfo.map(
    (element) => element._rawData
  );

  const selladoresdetailObj = selladoresDetailRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const selladoresDetail = selladoresdetailObj.map(
    ({ 1: Producto, 2: Sellador, 3: Formula, 4: Area }) => ({
      Producto,
      Sellador,
      Formula,
      Area,
    })
  );

  const herrajesDetailSheet = doc.sheetsByTitle['Detalle Herrajes'];
  const herrajesDetailInfo = await herrajesDetailSheet.getRows();
  const herrajesDetailRows = herrajesDetailInfo.map(
    (element) => element._rawData
  );

  const herrajesdetailObj = herrajesDetailRows.map((element) =>
    element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
  );

  const herrajesDetail = herrajesdetailObj.map(
    ({ 1: Producto, 2: Herraje, 3: Cantidad, 4: Area }) => ({
      Producto,
      Herraje,
      Cantidad,
      Area,
    })
  );

  return {
    productsInfo: products,
    quotationsInfo: quotations,
    quotesDetailInfo: quotesDetail,
    perfilesDetailInfo: perfilesDetail,
    perfilesInfo: perfiles,
    huecosInfo: huecosDetail,
    accesoriosInfo: accesorios,
    selladoresDetailInfo: selladoresDetail,
    herrajesDetailInfo: herrajesDetail,
  };
};

module.exports = { getInfo: getInfo() };
