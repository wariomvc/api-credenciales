import express from 'express';

const app = express();
app.use(express.json())

app.get('/', (_, res) => {
  res.json({
    ok: true
  })
})
app.listen(3000, () => {
  console.log('escuchando')
})
