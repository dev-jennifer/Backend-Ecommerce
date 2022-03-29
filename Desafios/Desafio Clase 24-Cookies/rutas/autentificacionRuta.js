import express from 'express';
const autentificacionRuta = express.Router();


autentificacionRuta.post('/login', (req, res) => {
    req.session.nombre = req.body.name
    res.redirect( '/' )
     
})

autentificacionRuta.get('/login', (req, res) => {
    const nombre = req.session.nombre
 
    if (nombre) {
        res.render('index',{nombre})
    } else {
        res.render("login.hbs")
    }
})

 
  
  autentificacionRuta.get('/logout', (req,res) => {
    req.session.destroy( err => {
        if(!err) res.send('Logout ok!')
        else res.send({status: 'Logout ERROR', body: err})
    })
  })

export default autentificacionRuta;
