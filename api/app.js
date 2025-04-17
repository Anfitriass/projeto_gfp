import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios from './routes/rotasUsuarios.js'
import rotasLocalTransacoes from './routes/rotasLocalTransacoes.js'
import rotasTransacoes from './routes/rotasTransacoes.js'

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Funcionando!')
})

// Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)// ✅
app.post('/usuarios/login', rotasUsuarios.login)// ✅
app.get('/usuarios', rotasUsuarios.listarUsuarios)// ✅
app.get('/usuarios/:id_usuario', rotasUsuarios.listarUsuariosPorID)// ✅
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)// ❌
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos)// ❌
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)// ❌

// Rotas Categorias
// app.post('/categorias', rotasCategorias.nova)
// app.get('/categorias', rotasCategorias.listar)
// app.get('/categorias/:id_categoria', rotasCategorias.listarPorID)
// app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)
// app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodas)
// app.delete('/categorias/:id_categoria', rotasCategorias.deletar)

// // Ratas Sub-Categorias
// app.post('/subCategorias', rotaSubCategorias.nova)
// app.get('/subCategorias', rotaSubCategorias.listar)
// app.get('/subCategorias/:id_subCategoria', rotaSubCategorias.listarPorID)
// app.patch('/subCategorias/:id_subCategoria', rotaSubCategorias.atualizar)
// app.put('/subCategorias/:id_subCategoria', rotaSubCategorias.atualizarTodos)
// app.delete('/subCategorias/:id_subCategoria', rotaSubCategorias.deletar)

// Rotas Local Transação 
app.post('/localTransacao', rotasLocalTransacoes.nova) // ✅
app.get('/localTransacao', rotasLocalTransacoes.listar) // ✅
app.get('/localTransacao/:id_localTransacao', rotasLocalTransacoes.listarPorID) // ✅
//app.patch('/localTransacao/:id_localTransacao', rotasLocalTransacoes.atualizar) // ❌
// app.put('/localTransacao/:id_localTransacao', rotasLocalTransacoes.atualizarTodos)
// app.delete('/localTransacao/:id_localTransacao', rotasLocalTransacoes.deletar)

// Rotas Transações
app.post('/transacao', rotasTransacoes.nova)
// app.get('/transacao', rotasTransacoes.listar)
// app.get('/transacao', rotasTransacoes.listarPorID)
// app.patch('/transacao', rotasTransacoes.atualizar)
// app.put('/transacao', rotasTransacoes.atualizarTodos)
// app.delete('/transacao', rotasTransacoes.deletar)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`);
})
