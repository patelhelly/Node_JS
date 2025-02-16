// console.log(process);
let args = process.argv;
for(let i = 2 ; i < args.length ; i++){
    console.log("Hello," +args[i]);
}
// Output:
// PS C:\Users\HELLY PATEL\Desktop\Node js\backend> node lecture2.js helly jenny
// Hello,helly
// Hello,jenny

//process is object which provide information and control over current Node.js process.

//process.argv returns array which contain command-line arguments passed when Node.js process is launched.
//node lecture2.js nodejs process HelloWorld!
// Output:  'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\HELLY PATEL\\Desktop\\Node js\\backend\\lecture2.js',
//   'nodejs',
//   'process',
//   'HelloWorld!'