import { app } from './app'


/**
 * Show 404 error if access to a wrong path.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

app.post('*', (_, res) => {
  res.status(404).send();
});

app.patch('*', (_, res) => {
  res.status(404).send();
});

app.delete('*', (_, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000.')
})