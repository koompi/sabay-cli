const { exec } = require('child_process');
const { Command } = require('commander');

function fetchToken(callback) {
  const curlCommand = 'curl -s http://localhost:8083/api/getAuth'; // -s for silent mode
  //console.log(`Running curl command: ${curlCommand}`); // Log the curl command
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      callback(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      callback(`Stderr: ${stderr}`);
      return;
    }
    callback(null, stdout);
  });
}

const tokenCommand = new Command('token')
  .description('Request a new token')
  .action(() => {
   // console.log('Fetching token...');
    fetchToken((error, response) => {
      if (error) {
        console.error(error);
        process.exit(1);
      } else {
        console.log(`Response: ${response}`);
      }
    });
  });

module.exports = tokenCommand;
