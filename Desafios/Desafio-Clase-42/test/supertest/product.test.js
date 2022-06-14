const request = require('supertest')('http://localhost:8080/api/productos/');
const expect = require('chai').expect;
const { existsSync, readFileSync, unlinkSync } = require('fs');
const assert = require('assert').strict;
const generadorProductos = require('../../src/faker/generador')
describe('GET /', function () {
  afterEach(function () {
    if (existsSync('todos.txt')) {
      unlinkSync('todos.txt');
    }
  });

  it('returns all products', async function () {
    const response = await request.get('/');
    expect(response.status).to.eql(200);
  });

   it('returns delete one product', async function () {
     const response = await request.delete('/62a666f8f9f7fa650cb8561265129ffefe88a');
     expect(response.status).to.eql(200);
   });
  it('returns post products', async function () {
 
 
    const response = await request
      .post('/')
      .set('content-type', 'application/json')
      .send( {
      nombre: 'Increible Madera Raton',
      descripcion: 'Genérico Madera Bacon',
      precio: 320,
      foto: 'https://loremflickr.com/300/300/commerce?94661',
      codigo: 'c2',
      stock: 100,
    });
    expect(response.status).to.eql(200);
  });

  it('returns update products', async function () {

    const response = await request
      .put('/62a90f01bfee6780cdc373da')
      .set('content-type', 'application/json')
      .send({
        nombre: 'Increible PC',
        foto: 'https://loremflickr.com/300/300/commerce?94661',
      });
    expect(response.status).to.eql(200);
  });


  
  beforeEach(function () {
    console.log('\n********* Comienzo Test *********');
  });

  afterEach(function () {
    console.log('********* Fin Test *********\n');
  });
});

//npx mocha product.test.js
