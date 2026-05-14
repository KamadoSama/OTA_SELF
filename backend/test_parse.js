const fs = require('fs');
const content = fs.readFileSync('curl_output.txt', 'utf-8');
const lines = content.split('\n');
const jsonLine = lines.find(l => l.startsWith('{"id":'));
try {
  JSON.parse(jsonLine);
  console.log('Valid JSON!');
} catch (e) {
  console.error('Invalid JSON:', e);
}
