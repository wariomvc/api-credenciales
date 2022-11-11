import express from 'express';


const app = express();
app.use(express.json())

app.use('/api/clientes', require('./routers/clientes.routers'))
app.get('/', (_, res) => {
  console.log('holka')
})
app.listen(3000, () => {
  console.log('escuchando')
})
