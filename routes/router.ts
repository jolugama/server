import { Request, Response, Router } from 'express';

export const router: Router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
  res.json({ message: 'It is ok', success: true });
});


export default router;
