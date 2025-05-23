import { BD } from "../db.js"

class rotasContas{
    static async nova (req, res){
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body
    
        // if (!nome || !tipo_conta || !saldo || !ativo) {
        //     return res.status(400).json({message: 'nome, tipo_conta, saldo, ativo são obrigatórios'})
        // }

        try{
            const conta = await BD.query(`INSERT INTO contas(nome, tipo_conta, saldo, ativo, conta_padrao) VALUES($1, $2, $3, $4, $5) `,[nome, tipo_conta, saldo, ativo, conta_padrao ])
            res.status(201).json("Contas certo")

        }catch(error){
            console.error('Erro ao criar conta transacao', error);
            res.status(500).json({message: 'Erro ao criar conta', error: error.message})
        }
    }

    static async listar(req, res){
        try{
            const contas = await BD.query("SELECT * FROM contas")
            return res.status(200).json(contas.rows)
        }catch(error){
            res.status(500).json({message:'Erro ao listar contas', error: error.message})
        }
    }

    static async listarPorID(req, res){
        const { id_conta } = req.params;
        try{
            const conta = await BD.query('SELECT * FROM contas WHERE id_conta = $1', [id_conta])
        res.status(200).json(conta.rows);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar conta", error: error.message})
        }
    }

    static async atualizar (req, res){
        const  {id_conta}  = req.params;
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;

        try{
            // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }

            if( tipo_conta !== undefined){
                campos.push(`tipo_conta = $${valores.length + 1}`)
                valores.push(tipo_conta);
            }

            if( saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }

            if( ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if( conta_padrao !== undefined){
                campos.push(`conta_padrao = $${valores.length + 1}`)
                valores.push(conta_padrao);
            }

            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
            }


            // Montamos a query dinamicamente
            const query = `UPDATE contas SET ${campos.join(', ')}  WHERE id_conta = ${id_conta} RETURNING * `
            // Executando nossa query
            const conta = await BD.query(query, valores)

            // Verifica se o usuario foi atualizado
            if(conta.rows.length === 0){
                return res.status(404).json({message: 'Conta não encontrado'})
            }

            return res.status(200).json(conta.rows[0])

        }catch(error){
            res.status(500).json({message: "Erro ao atualizar conta", error: error.message})
        }
    }

    static async atualizarTodos(req, res){
        const {id_conta} = req.params
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body

        try{
            const conta = await BD.query('UPDATE contas SET nome = $1, tipo_conta = $2, saldo = $3, ativo = $4, conta_padrao = $5 WHERE id_conta = $6 RETURNING *',
                [nome, tipo_conta, saldo, ativo, conta_padrao, id_conta] // Comando SQL para atualizar o usuario
            )
            res.status(200).json(conta.rows)
        
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar conta", error: error.message})
        }
    }

    static async deletar(req, res){
        const { id_conta } = req.params
        try{
            const conta = await BD.query('UPDATE contas SET ativo = false WHERE id_conta = $1', [id_conta])
            return res.status(200).json({message: "Conta deletado com sucesso"})
        }catch(error){
            res.status(500).json({message:"Erro ao deletar conta", error:error.message})
        }
    }

    static async filtrarConta(req, res){
        const {nome} = req.query;
        try{
             const query = `SELECT * FROM contas WHERE nome LIKE $1 AND ativo = true ORDER BY nome DESC`

             const valores = [`%${nome}%`]
             const resposta = await BD.query(query, valores)
             return res.status(200).json(resposta.rows)

        }catch(error){
             console.error('Erro ao filtrar conta', error)
             res.status(500).json({message: 'Erro ao filtrar contas', error: error.message})
        }
     }

}

export default rotasContas