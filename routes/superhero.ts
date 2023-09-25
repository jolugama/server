import { Request, Response, Router } from 'express';
const cache = require('./../utils/cache');

export const router: Router = Router();

// router.get('/mensajes', (req: Request, res: Response) => {
//   res.json({ message: 'It is ok', success: true });
// });

// router.post('/mensajes', (req: Request, res: Response) => {
//   const cuerpo = req.body.cuerpo;
//   const de = req.body.de;

//   res.json({ message: 'Post ok', success: true, cuerpo, de });
// });

// router.post('/mensajes/:id', (req: Request, res: Response) => {
//   const cuerpo = req.body.cuerpo;
//   const de = req.body.de;
//   const id= req.params.id;

//   res.json({ message: 'Post ok', success: true, cuerpo, de, id });
// });

router.get('/invoices', (req: Request, res: Response) => {
  res.send(cache.get('invoices'));
});

router.get('/products', (req: Request, res: Response) => {
  res.send(cache.get('product'));
});

router.get('/product/:productId', (req: Request, res: Response) => {
  const products = cache.get('product');
  const productId = req.params.productId;
  const product = products.filter((product: any) => product.productId === productId);
  const result = product.length > 0 ? product[0] : [];
  res.send(result);
});

router.get('/customers', (req: Request, res: Response) => {
  res.send(cache.get('customer'));
});

router.get('/customer/:customerId', (req: Request, res: Response) => {
  const customers = cache.get('customer');
  const customerId = req.params.customerId;
  const customer = customers.filter((customer: any) => customer.customerId === customerId);
  const result = customer.length > 0 ? customer[0] : [];
  res.send(result);
});

router.post('/invoice/save', (req: Request, res: Response) => {
  const body = req.body || {};
  const invoices = cache.get('invoices');
  const existInvoiceNo = invoices.filter((invoice: any) => invoice.invoiceNo === body.invoiceNo);

  if (existInvoiceNo && existInvoiceNo.length > 0) {
    // res.status(404);
    // res.send({
    //   code: 'Error',
    //   message: 'ya existe invoice no'
    // });
    res.json({  success: false });
  }else {
    invoices.push(body);
    cache.set('invoices',invoices);
    res.json({  success: true, invoiceNo: req.body.invoiceNo, invoice: req.body });
  }
});

export default router;

// Customer
// get /customer/GetAll
// get /customer/GetByCode

// Invoice
// get /invoice/GetAllHeader
// get /invoice/getAllHeaderByCode      param code:string
// get /invoice/getAllDetailByCode
// post /invoice/save
// delete /invoice/remove
