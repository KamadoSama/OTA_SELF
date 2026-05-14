const fs = require('fs');
const content = fs.readFileSync('curl_output.txt');

// find where headers end (\r\n\r\n)
let headerEnd = -1;
for (let i = 0; i < content.length - 3; i++) {
  if (content[i] === 13 && content[i+1] === 10 && content[i+2] === 13 && content[i+3] === 10) {
    headerEnd = i + 4;
    break;
  }
}
const bodyBytes = content.length - headerEnd;
console.log('Body bytes in curl output:', bodyBytes);
console.log('Content-Length header says: 16414');
