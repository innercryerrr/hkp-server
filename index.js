require('dotenv').config()

const { spawn } = require('child_process');

const authstr = `'if \
[ "$PROXY_AUTH_USERNAME" = "${process.env.USER}" ] && \
[ "$PROXY_AUTH_PASSWORD" = "${process.env.PASS}" ]; \
  then exit 0; \
fi; \
exit 1;'`;

var prores = spawn('zproxy', [
        '--authenticate', authstr, 
            '--local-address', '0.0.0.0'])

prores.stdout.on('data', (data) => {

    if (data.toString().includes('HTTP(s) proxy')) {
        console.log('\n    😊 ', data.toString())
        console.log('   auth -', process.env.USER, process.env.PASS)
    } else {
        console.log('  ', data.toString())
    }
})

prores.stderr.on('data', (data) => {
    console.log(`   ✓ stderr: ${data}`)
})

prores.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
})