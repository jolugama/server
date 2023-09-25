import { Request, Response, Router } from 'express';
import { Superheroes } from '../interfaces/superhero';
import { isSuperhero } from '../utils/util-superhero';
import cache from './../utils/cache';


export const router: Router = Router();
let countryKey = process.argv[2] || 'en';

router.get('/change-lang/:lang', (req, res) => {
  const lang = req.params.lang;
  const allowedLanguages = ['en', 'es', 'fr'];
  
  if (!lang || !allowedLanguages.includes(lang)) {
    return res.status(400).json({
      message: 'Invalid language. Allowed languages are en, es, and fr.',
      success: false
    });
  }
  countryKey = lang;
  res.json({ message: `lang is ${lang}`, success: true });
});

router.get('/superheroes', (req: Request, res: Response) => {
  res.send(cache.get(`${countryKey}-superheroes`));
});

router.get('/superhero/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const superheroes:Superheroes = cache.get(`${countryKey}-superheroes`)!;
  const superhero = superheroes.superheroes.find(hero => hero.id === id);

  if (!superhero) {
    return res.status(404).json({
      message: 'Superhero not found.',
      success: false
    });
  }

  res.json({
    superhero,
    success: true
  });
});



router.get('/superheroes/search/:substring', (req, res) => {
  const substring = req.params.substring.toLowerCase();
  const superheroes:Superheroes = cache.get(`${countryKey}-superheroes`)!;

  const filteredSuperheroes = superheroes.superheroes.filter(hero => 
    hero.name.toLowerCase().includes(substring)
  );

  if (filteredSuperheroes.length === 0) {
    return res.status(404).json({
      message: 'No superheroes found.',
      count: 0,
      success: false
    });
  }
  res.json({
    superheroes: filteredSuperheroes,
    count: filteredSuperheroes.length,
    success: true
  });
});


router.put('/superhero/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const superheroes:Superheroes = cache.get(`${countryKey}-superheroes`)!;

  const index = superheroes.superheroes.findIndex(hero => hero.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Superhero not found', success: false });
  }else if(Number(req.params.id) !== req.body.id){
    return res.status(404).json({ message: 'id cannot be changed', success: false });
  }else if (!isSuperhero(req.body)) {
    return res.status(400).json({ message: 'Invalid superhero data', success: false });
  }
  superheroes.superheroes[index] = { ...req.body };
  cache.set(`${countryKey}-superheroes`, superheroes);
  res.json({superhero: superheroes.superheroes[index], success: true});
});


router.post('/superhero', (req, res) => {
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;
  if (!isSuperhero(req.body, false)) {
    return res.status(400).json({ message: 'Invalid superhero data', success: false });
  }

  let nextId = Math.max(...superheroes.superheroes.map(hero => hero.id)) + 1;
  while (superheroes.superheroes.some(hero => hero.id === nextId)) {
    nextId++; 
  }

  const newSuperhero = { ...req.body, id: nextId };
  superheroes.superheroes.push(newSuperhero);
  cache.set(`${countryKey}-superheroes`, superheroes);
  res.json({ superhero: newSuperhero, success: true });
});



router.delete('/superhero/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const superheroes:Superheroes = cache.get(`${countryKey}-superheroes`)!;
  const index = superheroes.superheroes.findIndex(hero => hero.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Superhero not found' });
  }

  superheroes.superheroes.splice(index, 1);
  cache.set(`${countryKey}-superheroes`, superheroes);
  res.json({ message: 'Superhero deleted successfully', success: true });
});


export default router;
