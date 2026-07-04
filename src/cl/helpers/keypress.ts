// https://stackoverflow.com/a/49959557
export const keypress = async (s?: string): Promise<string> => {

  const USE_UTF8 = true;

  if (s) process.stdout.write(s);

  process.stdin.setRawMode(true)

  //
  // Required for Windows
  //
  process.stdin.resume();

  if (!USE_UTF8) {
    process.stdin.setEncoding('utf8');

    return new Promise(resolve => process.stdin.once('data', data => {
      const byteArray = Uint8Array.from(data)

      if (byteArray.length === 0) {
        console.log('Empty input');
        process.exit(1)
      }

      const numCharCode = byteArray[0];

      if (numCharCode === 3) {
        console.log('^C');
        process.exit(1)
      }

      process.stdin.setRawMode(false)

      //
      // Required for Windows
      //
      process.stdin.pause();

      const char = String.fromCharCode(numCharCode);
      return resolve(char);
    }))

  } else {
    process.stdin.setEncoding('utf8');

    return new Promise(resolve => process.stdin.once('data', data => {
      const strCharCode = data.toString();

      if (strCharCode === '\u0003') {
        console.log('^C');
        process.exit(1)
      }

      process.stdin.setRawMode(false)

      //
      // Required for Windows
      //
      process.stdin.pause();

      return resolve(strCharCode);
      //console.log('Cancelled')
      //process.exit(1)
    }))
  }

};

export default keypress;
