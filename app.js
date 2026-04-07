const express = require('express')
const app = express()
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended : true})); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const temasController = require('./controllers/temasController');
app.get('/', temasController.getTemas);

app.use('/temas', require('./routes/temasRoutes'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor escuchando en http//localhost:${PORT}`);
});

