require('dotenv').config();
const { analyzeResume } = require('./services/ai');

const fakeResume = `SUJIT KUMAR
Frontend Developer

PROJECTS

Portfolio Website
- Built website using React
- Made it look nice  
- Added some animations

Weather App
- Used API to get weather data
- Made responsive UI
`;

console.log('Testing gemini-2.5-flash...');
analyzeResume(fakeResume, 'Frontend Developer').then(r => {
  console.log('SUCCESS!');
  console.log('ATS Score:', r.atsScore);
  console.log('Projects:', r.projects.length);
  if (r.projects[0]) {
    console.log('Project:', r.projects[0].projectName);
    console.log('Bullet 1:', r.projects[0].improvedBullets[0]);
    console.log('Keywords:', r.projects[0].missingKeywords.join(', '));
  }
}).catch(e => {
  console.log('ERROR:', e.message);
});
