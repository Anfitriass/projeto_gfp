import { BD } from "../db.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'chave_api_gfp'

class rotasUsuarios{
    static async novoUsuario(req, res){
        const {nome, email, senha, tipo_acesso, ativo} = req.body

        const saltRounds = 10
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
        try{
            const usuario = await BD.query(`INSERT INTO usuarios(nome, email, senha, tipo_acesso, ativo) VALUES($1, $2, $3, $4, $5) `,[nome, email, senhaCriptografada, tipo_acesso, ativo])

            res.status(201).json("Usuario Cadastrado")

        }catch(error){
            console.error('Erro ao criar usuario', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body

        try {
            const resultado = await BD.query('SELECT id_usuario, nome, email, senha FROM usuarios WHERE email = $1', [email])
            if (resultado.rows.length === 0) {
                return res.status(401).json({message: 'Email e senha inválidos'})
            }
            const usuario = resultado.rows[0]
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if(!senhaValida) {
                return res.status(401).json('Email ou senha invalido')
            }

            // Gerar um novo token para usuarios
            const token = jwt.sign(
                // Payload
                {id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email},
                // Signature
                SECRET_KEY,
                {expiresIn: '1h'}
            )

            res.status(200).json({message: 'Login realizado com sucesso', token})
            //res.status(200).json({message: 'Login realizado com sucesso', usuario})
        } catch(error) {
            console.error('Erro ao realizar login: ', error)
            return res.status(500).json({message: 'Erro ao realizar login: ', error: error.message})
        }
    }

    static async listarUsuarios(req, res){
        try{
            // const usuarios = await Usuario.listar() // Chamar o metodo listar na models usuario
            const usuarios = await BD.query("SELECT * FROM usuarios")
            return res.status(200).json(usuarios.rows) // Retorna a lista de usuarios
        }catch(error){
            res.status(500).json({message:'Erro ao listar usuarios', error: error.message})
        }
    }

    static async deletar(req, res){
        const { id_usuario } = req.params
        try{
            const usuario = await BD.query('DELETE FROM usuarios WHERE id = $1', [id_usuario])
            return res.status(200).json({message: "Usuario deletado com sucesso"})
        }catch(error){
            res.status(500).json({message:"Erro ao deletar usuario", error:error.message})
        }
    }

    static async listarUsuariosPorID(req, res){
        const { id_usuario } = req.params;
        try{
            const usuario = await BD.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario])
        res.status(200).json(usuario.rows);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar usuario", error: error.message})
        }
    }

    static async atualizarTodos(req, res){
        const { id_usuario } = req.params;
        const {nome, email, senha, tipo_acesso, ativo} = req.body

        try{
            const usuario = await BD.query('UPDATE usuarios SET nome = $1 email = $2, senha = $3, tipo_acesso = $4, ativo = $5 WHERE id_usuario = $6 RETURNING *',
                [nome, email, senha, tipo_acesso, ativo, id_usuario] // Comando SQL para atualizar o usuario
            )
            res.status(200).json(usuario.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar usuario", error: error.message})
        }
    }

    static async atualizar (res, req){
        const  id_usuario  = req.params;
        const {nome, email, senha, tipo_acesso, ativo} = req.body;

        try{
            // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }

            if( email !== undefined){
                campos.push(`email = $${valores.length + 1}`)
                valores.push(email);
            }

            if( senha !== undefined){
                campos.push(`senha = $${valores.length + 1}`)
                valores.push(senha);
            }

            if( tipo_acesso !== undefined){
                campos.push(`tipo_acesso = $${valores.length + 1}`)
                valores.push(tipo_acesso);
            }

            if( ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
            }


            // Montamos a query dinamicamente
            const query = `UPDATE usuarios SET ${campos.join(', ')}  WHERE id_usuario = ${id_usuario} RETURNING * `
            // Executando nossa query
            const usuario = await BD.query(query, valores)

            // Verifica se o usuario foi atualizado
            if(usuario.rows.length === 0){
                return res.status(404).json({message: 'Usuario não encontrado'})
            }

            return res.status(200).json(usuario.rows[0])

        }catch(error){
            res.status(500).json({message: "Erro ao atualizar usuario", error: error.message})
        }
    }
}

export function autenticarToken(req, res, next){
    // Extrair to token o cabeçalho da requisição
    const token = req.headers['authorization']; // Bearer<token>

    // Verificar se o token foi fornecido na requisição
    if(!token) return res.status(403).json({mensagem: 'Token não fornecido'})

    // Verificar a validade do token
    // jwt.verify que valida se o token é legitimo
    jwt.verify(token.split('')[1], SECRET_KEY, (err, usuario) => {
        if(err) return res.status(403).json({mensagem: 'Token invalido'})

        // Se o token for valido, adiciona os dados do usuario(decodificado no token)
        // Tornando essas informações disponiveis nas rotas que precisam da autenticação
        req.usuario = usuario,
        next()
    })


}

export default rotasUsuarios