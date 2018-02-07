const execSeriesAsync = require('./libs/exec-series-async');

const outputPath = 'dist';

const cmdSeries = [
  `cd ${outputPath}`,
  'git config user.name "Quang Lam"',
  'git config user.email "quang.lam2807@gmail.com"',
  'git add .',
  `git remote add origin https://${process.env.GH_TOKEN}@github.com/quanglam2807/law-data.git`,
  'git push origin law -f', // Push new Git history to remote repo
];

execSeriesAsync(cmdSeries)
  .then(() => {
    // eslint-disable-next-line
    console.log('Distributed. Done.');
  });
