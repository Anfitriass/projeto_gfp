import { BD } from "../db.js"
import bcrypt from "bcrypt"

class rotasCategorias{

    static async nova(req, res){
        const {nome, tipo_transacao, gasto_fixo, ativo} = req.body

        const saltRounds = 10
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
        try{
            const usuario = await BD.query(`INSERT INTO usuarios(nome, email, senha, tipo_acesso) VALUES($1, $2, $3, $4) `,[nome, email, senhaCriptografada, tipo_acesso])

            res.status(201).json("Usuario Cadastrado")

        }catch(error){
            console.error('Erro ao criar usuario', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
        }
    }
}

export default rotasCategorias
