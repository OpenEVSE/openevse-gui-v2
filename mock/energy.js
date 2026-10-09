// Dev-mode mock data for energy API endpoints
// rawSamples is real device data captured from /api/energy/raw

export const rawSamples = {"samples":[{"ts":1779055985,"a":0,"t":0,"e":0},{"ts":1779056044,"a":0,"t":33.1,"e":0},{"ts":1779056104,"a":0,"t":33.2,"e":0},{"ts":1779056164,"a":0,"t":33.3,"e":0},{"ts":1779056224,"a":0,"t":33.3,"e":0},{"ts":1779056284,"a":0,"t":33.4,"e":0},{"ts":1779056344,"a":0,"t":33.4,"e":0},{"ts":1779056404,"a":0,"t":33.5,"e":0},{"ts":1779056464,"a":0,"t":33.6,"e":0},{"ts":1779056524,"a":0,"t":33.6,"e":0},{"ts":1779056584,"a":0,"t":33.7,"e":0},{"ts":1779056644,"a":0,"t":33.8,"e":0},{"ts":1779056704,"a":0,"t":33.8,"e":0},{"ts":1779056764,"a":0,"t":33.8,"e":0},{"ts":1779056824,"a":0,"t":33.7,"e":0},{"ts":1779056884,"a":0,"t":33.7,"e":0},{"ts":1779056944,"a":0,"t":33.6,"e":0},{"ts":1779057004,"a":0,"t":33.6,"e":0},{"ts":1779057064,"a":0,"t":33.6,"e":0},{"ts":1779057124,"a":0,"t":33.5,"e":0},{"ts":1779057184,"a":0,"t":33.6,"e":0},{"ts":1779057244,"a":0,"t":33.5,"e":0},{"ts":1779057304,"a":0,"t":33.5,"e":0},{"ts":1779057364,"a":0,"t":33.5,"e":0},{"ts":1779057424,"a":0,"t":33.5,"e":0},{"ts":1779057484,"a":0,"t":33.4,"e":0},{"ts":1779057544,"a":0,"t":33.4,"e":0},{"ts":1779057604,"a":0,"t":33.4,"e":0},{"ts":1779057664,"a":0,"t":33.3,"e":0},{"ts":1779057724,"a":0,"t":33.3,"e":0},{"ts":1779057784,"a":0,"t":33.3,"e":0},{"ts":1779057844,"a":0,"t":33.3,"e":0},{"ts":1779057904,"a":0,"t":33.3,"e":0},{"ts":1779057964,"a":0,"t":33.3,"e":0},{"ts":1779058024,"a":0,"t":33.3,"e":0},{"ts":1779058084,"a":0,"t":33.2,"e":0},{"ts":1779058144,"a":0,"t":33.2,"e":0},{"ts":1779058204,"a":0,"t":33.1,"e":0},{"ts":1779058264,"a":0,"t":33.1,"e":0},{"ts":1779058324,"a":0,"t":33,"e":0}]};

export function registerEnergyMocks(middlewares) {
  middlewares.use('/api/energy/raw', (req, res, next) => {
    if (req.method !== 'GET') return next();
    const url = new URL(req.url, 'http://localhost');
    const before = Number(url.searchParams.get('before') ?? 0);
    res.setHeader('Content-Type', 'application/json');
    if (before > 0) {
      // Return empty so the "No earlier data" state is exercised in dev
      res.end(JSON.stringify({ samples: [] }));
    } else {
      res.end(JSON.stringify(rawSamples));
    }
  });

  // Stub responses for daily/monthly/annual so the summary chart also renders
  middlewares.use('/api/energy/daily', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ daily: [] }));  // stub — no historical daily data in dev
  });

  middlewares.use('/api/energy/monthly', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ monthly: [] }));
  });

  middlewares.use('/api/energy/annual', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ annual: [] }));
  });
}
