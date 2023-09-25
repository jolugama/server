import { Request, Response, Router } from 'express';

export const router: Router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
  res.json({ message: 'It is ok', success: true });
});

router.post('/mensajes', (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  res.json({ message: 'Post ok', success: true, cuerpo, de });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id= req.params.id;

  res.json({ message: 'Post ok', success: true, cuerpo, de, id });
});

export default router;
