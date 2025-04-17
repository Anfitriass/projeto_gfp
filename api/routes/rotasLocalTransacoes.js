import { BD } from "../db.js"

class rotasLocalTransacoes{
    static async nova (req, res){
        const {nome, tipo_local, saldo, ativo} = req.body
    
        // if (!nome || !tipo_local || !saldo || !ativo) {
        //     return res.status(400).json({message: 'nome, tipo_local, saldo, ativo são obrigatórios'})
        // }

        try{
            const localTransacao = await BD.query(`INSERT INTO local_transacao(nome, tipo_local, saldo, ativo) VALUES($1, $2, $3, $4) `,[nome, tipo_local, saldo, ativo])
            res.status(201).json("Local transação certo")

        }catch(error){
            console.error('Erro ao criar local transacao', error);
            res.status(500).json({message: 'Erro ao criar local transacao', error: error.message})
        }
    }

    static async listar(req, res){
        try{
            const localTransacoes = await BD.query("SELECT * FROM local_transacao")
            return res.status(200).json(localTransacoes.rows)
        }catch(error){
            res.status(500).json({message:'Erro ao listar local transacoes', error: error.message})
        }
    }

    static async listarPorID(req, res){
        const { id } = req.params;
        try{
            const localTransacao = await BD.query('SELECT * FROM local_transacao WHERE id_local_transacao = $1', [id])
        res.status(200).json(localTransacao.rows);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar local transacao", error: error.message})
        }
    }

    static async atualizar (res, req){
        const  id  = req.params;
        const {nome, tipo_local, saldo, ativo} = req.body;

        try{
            // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }

            if( tipo_local !== undefined){
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local);
            }

            if( saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }

            if( ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
            }


            // Montamos a query dinamicamente
            const query = `UPDATE local_transacao SET ${campos.join(', ')}  WHERE id_local_transacao = ${id} RETURNING * `
            // Executando nossa query
            const localTransacao = await BD.query(query, valores)

            // Verifica se o usuario foi atualizado
            if(localTransacao.rows.length === 0){
                return res.status(404).json({message: 'Local transacao não encontrado'})
            }

            return res.status(200).json(localTransacao.rows[0])

        }catch(error){
            res.status(500).json({message: "Erro ao atualizar local transacao", error: error.message})
        }
    }
}

export default rotasLocalTransacoes