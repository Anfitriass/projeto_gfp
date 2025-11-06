import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios, { autenticarToken } from './routes/rotasUsuarios.js'
import rotasCategorias from './routes/rotasCategorias.js'
import rotasSubCategorias from './routes/rotasSubCategorias.js'
import rotasContas from './routes/rotasContas.js'
import rotasTransacoes from './routes/rotasTransacoes.js'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/', (req, res) => {
    // res.send('API Funcionando!')
    res.redirect('/api-docs');
})

// Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)// ✅
app.post('/usuarios/login', rotasUsuarios.login)// ✅
app.get('/usuarios', autenticarToken, rotasUsuarios.listarUsuarios)// ✅ // Token não funciona❌
app.get('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.listarUsuariosPorID)// ✅ // Token não funciona❌
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar)// ✅
app.put('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizarTodos)// ✅
app.delete('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.deletar)// ✅

// Rotas Categorias
app.get('/categorias/filtrarCategoria', rotasCategorias.filtrarCategoria) // ✅
app.post('/categorias', rotasCategorias.nova) // ✅
app.get('/categorias', autenticarToken, rotasCategorias.listar) // ✅
app.get('/categorias/:id_categoria', autenticarToken, rotasCategorias.listarPorID) // ✅
app.patch('/categorias/:id_categoria', autenticarToken, rotasCategorias.atualizar) // ✅
app.put('/categorias/:id_categoria', autenticarToken, rotasCategorias.atualizarTodos) // ❌
app.delete('/categorias/:id_categoria', autenticarToken, rotasCategorias.deletar) // ✅

// Ratas Sub-Categorias
app.post('/subCategorias', rotasSubCategorias.nova) // ✅
app.get('/subCategorias', rotasSubCategorias.listar) // ✅
app.get('/subCategorias/:id_subcategoria', rotasSubCategorias.listarPorID) // ❌
app.patch('/subCategorias/:id_subcategoria', rotasSubCategorias.atualizar) // ❌
app.put('/subCategorias/:id_subcategoria', rotasSubCategorias.atualizarTodos)
app.delete('/subCategorias/:id_subcategoria', rotasSubCategorias.deletar)

// Rotas Contas
app.get('/contas/filtrarConta', rotasContas.filtrarConta) // Da 200ok mas não retorna❗
app.post('/contas', rotasContas.nova) // ✅
app.get('/contas', rotasContas.listar) // ✅
app.get('/contas/:id_conta', rotasContas.listarPorID) // ✅
app.patch('/contas/:id_conta', rotasContas.atualizar) // ✅
app.put('/contas/:id_conta', rotasContas.atualizarTodos) // ✅
app.delete('/contas/:id_conta', rotasContas.deletar) // Da 200ok mas não deleta a conta❗

// Rotas Transações
app.post('/transacoes/somarTransacoes', rotasTransacoes.somarTransacoes) // 
app.get('/transacoes/filtrarData', rotasTransacoes.filtrarPorData) // 
app.get('/transacoes/dadosDashboard', rotasTransacoes.dadosDashboard) // 
app.get('/transacoes/transacoesVencidas/:id_usuario', rotasTransacoes.transacoesVencidas) // 
app.post('/transacoes', rotasTransacoes.nova) // ✅
app.get('/transacoes', rotasTransacoes.listar)
app.get('/transacoes/:id_transacao', rotasTransacoes.listarTransacao)
app.patch('/transacoes/:id_transacao', rotasTransacoes.atualizar)
// app.put('/transacoes/:id_transacao', rotasTransacoes.atualizarTodos)
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletar)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`);
})
