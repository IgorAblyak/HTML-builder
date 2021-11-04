const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface( { input, output } );

let writableStream = fs.createWriteStream(filePath);

rl.question('Введите желаемый текст: ' + '\n', (answer) => {

  answer = answer.toString().trim();

  if (answer.match(/^exit$/i)) {
    writableStream.end();
    process.exit();
  }

  writableStream.write(answer + '\n');

});

writableStream.on('error', err => output.write('ERROR'+'\n', err));

rl.on('line', input => {
  if (input.match(/^exit$/i)) {
    writableStream.end();
    process.exit();
  }
  
  writableStream.write(input.trim() + '\n');
  
});

rl.on('SIGINT', () => {
  rl.question(
    'Are you sure you want to exit? ',
    (answer) => {
      if (answer.match(/^y(es)?$/i)) {
        rl.pause();
      }
    }
  );
});

process.on('exit', () => {
  output.write('See you soon!');
});