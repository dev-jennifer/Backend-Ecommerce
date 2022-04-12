// process.on("message", function (message) {
//   const result = getRandom(message);
//   console.log(`Message from main.js: ${message}`);
//   process.send(result);
// });
// child.js
process.on('message', msg => {
  console.log(`mensaje del padre: ${msg}`)
  const result = getRandom(msg);
  process.send(result)
  setTimeout(process.exit, 5000)
 })
 process.send('ok')

 
function getRandom(cantidad) {
  console.log("cantidad", cantidad);
  let min = 1,
    max = 1000;

  let valores = [];
  while (valores.length < cantidad) {
    const value = Math.round(Math.random() * (max - min) + min);
    if (valores.indexOf(value) < 0) valores.push(value);
  }
  return valores;
}
