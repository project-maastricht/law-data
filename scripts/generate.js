const glob = require('glob');
const path = require('path');
const execSeriesAsync = require('./libs/exec-series-async');

const outputPath = 'dist';

// options is optional
glob('data/**/*.md', null, (er, files) => {
  const commits = files
    .map((file) => {
      const fileName = path.basename(file);
      const date = fileName.replace('.md', '');
      const documentPath = file.replace(`/${fileName}`, '').replace('data/', '');

      return { date, documentPath };
    });

  commits
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const cmdSeries = [
    `rm -rf ${outputPath}`,
    `mkdir ${outputPath}`,
    `cd ${outputPath}`,
    'git init',
    'git checkout --orphan law',
  ];

  commits.forEach((commit) => {
    const t = commit.date.split('-');
    const epochDate = new Date('1970', '01', '01').toISOString();
    // Git only supports date > epoch
    const commitDate = t[0] > '1970' ? new Date(t[0], t[1], t[2]).toISOString() : epochDate;

    const country = commit.documentPath.substr(0, 2);

    let authorName;
    let authorEmail;

    switch (country) {
      case 'us':
        authorName = 'U.S Congress';
        authorEmail = 'email@congress.gov';
        break;
      case 'vn':
        authorName = 'Vietnam National Assembly';
        authorEmail = 'hotro@qh.gov.vn';
        break;
      default:
        break;
    }


    const committerName = 'Quang Lam';
    const committerEmail = 'quang.lam2807@gmail.com';

    cmdSeries.push(
      `mkdir -p ../${outputPath}/${commit.documentPath.replace(path.basename(commit.documentPath), '')}`,
      `cp ../data/${commit.documentPath}/${commit.date}.md ../${outputPath}/${commit.documentPath}.md`,
      `git config user.name "${authorName}"`,
      `git config user.email "${authorEmail}"`,
      'git add .',
      `GIT_COMMITTER_NAME="${committerName}" GIT_COMMITTER_EMAIL="${committerEmail}" GIT_AUTHOR_DATE="${commitDate}" GIT_COMMITTER_DATE="${commitDate}" git commit -m "${commit.documentPath} (${commit.date})"`,
    );
  });

  execSeriesAsync(cmdSeries)
    .then(() => {
      // eslint-disable-next-line
      console.log('Generated. Done.');
    });
});
