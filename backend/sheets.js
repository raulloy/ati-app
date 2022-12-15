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

  const perfilesDetailSheet = doc.sheetsByTitle['Detalle Perfiles']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const perfilesDetailInfo = await perfilesDetailSheet.getRows(); // can pass in { limit, offset }
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

  const perfilesSheet = doc.sheetsByTitle['Perfiles']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const perfilesInfo = await perfilesSheet.getRows(); // can pass in { limit, offset }
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

  return {
    productsInfo: products,
    quotationsInfo: quotations,
    quotesDetailInfo: quotesDetail,
    perfilesDetailInfo: perfilesDetail,
    perfilesInfo: perfiles,
  };
};

// const getDetailInfo = async () => {
//   // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
//   await doc.useServiceAccountAuth({
//     // env var values are copied from service account credentials generated by google
//     // see "Authentication" section in docs for more info
//     client_email: 'ati-test@ati-test-367319.iam.gserviceaccount.com',
//     private_key:
//       '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2gABZdtcWiOG7\n94Fpm4csyxeTGGs1rDsVnDgtgaDCSmpuBB9pFmY6G+/ah3scIeCxE2C2Pg+i/wZo\neRfBOkiPJlOP8B0Uyh829WfPqiv7dX6/QJ9H03EKq+qaZjUrb1r80iD+sNtaXBb9\nlrcX8V1IOBVRNLjXG/+8TN++qLr+7dDLTeMZ7FFIE52aGG7/IeqOFftx5BqKTV39\nVH09EKHmIT+dCNWQ5bnlJrGJUSvEZmI6WVMnUb1wKfwC4S6fEXvPBsXMqsTq5k8M\nHhVvsRrfFBYQZoRlhh4n/v6gsT47X4GsYYLDHsNAs5CnutZMNQ2ZPZV957pHL23U\nUdxTqoy5AgMBAAECggEAAo08SVlHB/KhWAki5Gt0nWS4Of9KaHVgXMdSuxgn5kTi\nGL2yrrvNxsbjOKanoFdnloeTKkPTNiU4srdBZMXq2SLhDOR/k5iBN+SAhL/NXku1\n76NOAX7BrYjafo7VSXvaGtTZT0EBICdPeaY6KHngeFpdue/xxwLbitzMTWnQi4Xu\nViYWCSYR5LWlL8Wb3ndCXzBRoM2jRQqeGjhcdTpjqEpXXxLJ+G97rmDBgy1zicbK\nx2b4feS6K4xt1tWUCnEGHO2TBZMjjUoPYeFVhIu6sw2hlC3ZIIGf/OWLTGVHsqmN\ne8T25wDhvxqQsAL8bdTRtC8zbBamMRm+aJuj5J6dsQKBgQDiIaUKc7tM/Lbzw/rG\n/iPrOY0aPW4GM5u52bywCaQY0LHsP1lVDGbpZrwI39RzWmGhHYJI9aWlxBIsXxe+\n4OhlVmdsXCq2sPK50O/YNt4BdY8NIEABwsq8fiwW28XcGZ85qbhcpKKchbgiPfdt\nSQ59jBD7BnQxaXNRNhrMRitRbQKBgQDOmwOXZXCzzZYOqsbfBQ3H45FP5WrKfLhm\nKcvDEmhIo0OmyHRy29AUa6tpQz8O3QdMvtqbsWDUc8V5PVN7eJQGvxy1l2GpWIL+\nYr6oWVlo6IrpVCPpESd0VC/KFElR8bjKY2Km62t1bMNtsXerdhckBpbIS9lVt6ou\nxa+0n+7k/QKBgD8S813++fd3ZfCIcaKfsJUj8F+pUs8YBg/I1ACmL8dcLsSexuQa\nGXpw1XIEPNYQF7tA595B5npePlNyEsWDJk9d0ms/KgrbQFjkFoJQi4wMpmIa5L+Y\n/cOlzdZyZrYFz4vd8zakFVdjVQD4F9O71Pbf4ryiCDbgGvJEDSV9TQfhAoGBAINl\nctNGYHb5uQV69x+/RxRpVnFJprFAwMW4ry5Q9qG7s7rOocCqq5tRHqLDcccyKwJU\nHxQFq19ygZSpu/46oWnpAYk7zZC2ChlfE4Jd0M83laDvMid4EW+aWwpZ/IdxA+Uz\nb/pYnu7/TQrmYwVZBT6UMjEQjBhHxqQYdbaaQITBAoGBAIvm4VfdzLrazcRQvLFE\nJiNqxkg1XgoEH+9wkQ7uqgn290oGQE8829sD559D7OpBhsrxbXequku5RoJ/1z6r\nvyX8jHYMz/0N8sOjShaBZgYH1VHDNnpX3FuKHsL6Sj5DYhA+BMGSLc8WBaqa4GD+\nN0qIliYXaDLVp97NjLpuTDfN\n-----END PRIVATE KEY-----\n',
//   });

//   await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc.title, '- DataBase Detail Table');

//   const sheet = doc.sheetsByTitle['Detalle']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
//   const rows = await sheet.getRows(); // can pass in { limit, offset }
//   const detailRows = rows.map((element) => element._rawData);

//   const detailObj = detailRows.map((element) =>
//     element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
//   );

//   const detail = detailObj.map(
//     ({
//       0: ID,
//       1: ID_Cotizacion,
//       2: Ubicacion,
//       4: Tipo,
//       5: Codigo,
//       6: Descripcion,
//       8: Unidad,
//       10: Alto,
//       11: Ancho,
//       12: Referencia,
//       28: Importe,
//     }) => ({
//       ID,
//       ID_Cotizacion,
//       Ubicacion,
//       Tipo,
//       Codigo,
//       Descripcion,
//       Unidad,
//       Alto,
//       Ancho,
//       Referencia,
//       Importe,
//     })
//   );

//   return {
//     productRowsInfo: detail,
//   };
// };

// const getDetailPerfilesInfo = async () => {
//   // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
//   await doc.useServiceAccountAuth({
//     // env var values are copied from service account credentials generated by google
//     // see "Authentication" section in docs for more info
//     client_email: 'ati-test@ati-test-367319.iam.gserviceaccount.com',
//     private_key:
//       '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2gABZdtcWiOG7\n94Fpm4csyxeTGGs1rDsVnDgtgaDCSmpuBB9pFmY6G+/ah3scIeCxE2C2Pg+i/wZo\neRfBOkiPJlOP8B0Uyh829WfPqiv7dX6/QJ9H03EKq+qaZjUrb1r80iD+sNtaXBb9\nlrcX8V1IOBVRNLjXG/+8TN++qLr+7dDLTeMZ7FFIE52aGG7/IeqOFftx5BqKTV39\nVH09EKHmIT+dCNWQ5bnlJrGJUSvEZmI6WVMnUb1wKfwC4S6fEXvPBsXMqsTq5k8M\nHhVvsRrfFBYQZoRlhh4n/v6gsT47X4GsYYLDHsNAs5CnutZMNQ2ZPZV957pHL23U\nUdxTqoy5AgMBAAECggEAAo08SVlHB/KhWAki5Gt0nWS4Of9KaHVgXMdSuxgn5kTi\nGL2yrrvNxsbjOKanoFdnloeTKkPTNiU4srdBZMXq2SLhDOR/k5iBN+SAhL/NXku1\n76NOAX7BrYjafo7VSXvaGtTZT0EBICdPeaY6KHngeFpdue/xxwLbitzMTWnQi4Xu\nViYWCSYR5LWlL8Wb3ndCXzBRoM2jRQqeGjhcdTpjqEpXXxLJ+G97rmDBgy1zicbK\nx2b4feS6K4xt1tWUCnEGHO2TBZMjjUoPYeFVhIu6sw2hlC3ZIIGf/OWLTGVHsqmN\ne8T25wDhvxqQsAL8bdTRtC8zbBamMRm+aJuj5J6dsQKBgQDiIaUKc7tM/Lbzw/rG\n/iPrOY0aPW4GM5u52bywCaQY0LHsP1lVDGbpZrwI39RzWmGhHYJI9aWlxBIsXxe+\n4OhlVmdsXCq2sPK50O/YNt4BdY8NIEABwsq8fiwW28XcGZ85qbhcpKKchbgiPfdt\nSQ59jBD7BnQxaXNRNhrMRitRbQKBgQDOmwOXZXCzzZYOqsbfBQ3H45FP5WrKfLhm\nKcvDEmhIo0OmyHRy29AUa6tpQz8O3QdMvtqbsWDUc8V5PVN7eJQGvxy1l2GpWIL+\nYr6oWVlo6IrpVCPpESd0VC/KFElR8bjKY2Km62t1bMNtsXerdhckBpbIS9lVt6ou\nxa+0n+7k/QKBgD8S813++fd3ZfCIcaKfsJUj8F+pUs8YBg/I1ACmL8dcLsSexuQa\nGXpw1XIEPNYQF7tA595B5npePlNyEsWDJk9d0ms/KgrbQFjkFoJQi4wMpmIa5L+Y\n/cOlzdZyZrYFz4vd8zakFVdjVQD4F9O71Pbf4ryiCDbgGvJEDSV9TQfhAoGBAINl\nctNGYHb5uQV69x+/RxRpVnFJprFAwMW4ry5Q9qG7s7rOocCqq5tRHqLDcccyKwJU\nHxQFq19ygZSpu/46oWnpAYk7zZC2ChlfE4Jd0M83laDvMid4EW+aWwpZ/IdxA+Uz\nb/pYnu7/TQrmYwVZBT6UMjEQjBhHxqQYdbaaQITBAoGBAIvm4VfdzLrazcRQvLFE\nJiNqxkg1XgoEH+9wkQ7uqgn290oGQE8829sD559D7OpBhsrxbXequku5RoJ/1z6r\nvyX8jHYMz/0N8sOjShaBZgYH1VHDNnpX3FuKHsL6Sj5DYhA+BMGSLc8WBaqa4GD+\nN0qIliYXaDLVp97NjLpuTDfN\n-----END PRIVATE KEY-----\n',
//   });

//   await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc.title, '- DataBase Detail Perfiles Table');

//   const sheet = doc.sheetsByTitle['Detalle Perfiles']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
//   // console.log(sheet.title);
//   // console.log(sheet.rowCount);
//   const rows = await sheet.getRows(); // can pass in { limit, offset }
//   const detailRows = rows.map((element) => element._rawData);

//   const detailObj = detailRows.map((element) =>
//     element.reduce((acc, v, index) => ({ ...acc, [index]: v }), {})
//   );

//   const detailPerfiles = detailObj.map(
//     ({ 1: Producto, 2: Perfil, 3: Cantidad, 6: Formula }) => ({
//       Producto,
//       Perfil,
//       Cantidad,
//       Formula,
//     })
//   );

//   return {
//     productRowsInfo: detailPerfiles,
//   };
// };

module.exports = { getInfo: getInfo() };