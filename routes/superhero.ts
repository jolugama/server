import { Request, Response, Router } from 'express';
import { Superheroes } from '../interfaces/superhero';
import { isSuperhero } from '../utils/util-superhero';
import cache from './../utils/cache';


export const router: Router = Router();
let countryKey = process.argv[2] || 'en';

// TODO: move to other file
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
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!

  if (superheroes.superheroes.length === 0) {
    res.status(404).send('Superheroes not found');
    return;
  }
  const pageIndex = Number(req.query.pageIndex) || 0;
  const pageSize = Number(req.query.pageSize) || 5;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  res.send({
    superheroes: superheroes.superheroes.slice(start, end),
    length: superheroes.superheroes.length,
    pageSize: pageSize,
    pageIndex: pageIndex,
  });
});



router.get('/superhero/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;
  const superhero = superheroes.superheroes.find(hero => hero.id === id);

  if (!superhero) {
    return res.status(404).json({
      message: 'Superhero not found.',
      success: false
    });
  }

  res.json({
    superheroes: [superhero],
    success: true
  });
});


router.get('/superheroes/search', (req, res) => {
  const { name, alias, description, universe, abilities } = req.query;
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;
  let fSuperHeroes = superheroes.superheroes;

  if (name) {
    // fSuperHeroes = fSuperHeroes.filter(hero => hero.name.toLowerCase().includes(name.toString().toLowerCase()));
    fSuperHeroes = fSuperHeroes.filter(hero =>
      hero.name.toLowerCase().includes(name.toString().toLowerCase()) ||
      hero.alias?.toLowerCase().includes(name.toString().toLowerCase())
    );
  }
  // if (alias) {
  //   fSuperHeroes = fSuperHeroes.filter(hero => hero.alias.toLowerCase().includes(alias.toString().toLowerCase()));
  // }
  if (description) {
    fSuperHeroes = fSuperHeroes.filter(hero => hero.description.toLowerCase().includes(description.toString().toLowerCase()));
  }
  if (universe) {
    fSuperHeroes = fSuperHeroes.filter(hero => hero.universe.toString().toLowerCase() === universe.toString().toLowerCase());
  }
  if (abilities) {
    const abilitiesArray = abilities.toString().toLowerCase().trim().split(',');
    fSuperHeroes = fSuperHeroes.filter(hero =>
      abilitiesArray.every(ab =>
        hero.abilities.map(a => a.toString().toLowerCase()).includes(ab)
      )
    );
  }

  if (fSuperHeroes.length === 0) {
    return res.status(404).json({
      message: 'No superheroes found.',
      count: 0,
      success: false
    });
  }

  const pageIndex = Number(req.query.pageIndex) || 0;
  const pageSize = Number(req.query.pageSize) || 5;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  // order by name
  fSuperHeroes = fSuperHeroes.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
);
  res.send({
    superheroes: fSuperHeroes.slice(start, end),
    length: fSuperHeroes.length,
    pageSize: pageSize,
    pageIndex: pageIndex,
  });
});

router.get('/superheroes/searchByName/:substring', (req, res) => {
  const substring = req.params.substring.toLowerCase();
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;

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
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;

  const index = superheroes.superheroes.findIndex(hero => hero.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Superhero not found', success: false });
  } else if (Number(req.params.id) !== req.body.id) {
    return res.status(404).json({ message: 'id cannot be changed', success: false });
  } else if (!isSuperhero(req.body)) {
    return res.status(400).json({ message: 'Invalid superhero data', success: false });
  }
  superheroes.superheroes[index] = { ...req.body };
  cache.set(`${countryKey}-superheroes`, superheroes);
  res.json({ superhero: superheroes.superheroes[index], success: true });
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
  const superheroes: Superheroes = cache.get(`${countryKey}-superheroes`)!;
  const index = superheroes.superheroes.findIndex(hero => hero.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Superhero not found' });
  }

  superheroes.superheroes.splice(index, 1);
  cache.set(`${countryKey}-superheroes`, superheroes);
  res.json({ message: 'Superhero deleted successfully', success: true });
});


export default router;
