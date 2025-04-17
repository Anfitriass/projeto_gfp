import { BD } from "../db.js"

class rotasTransacoes{
    static async nova (req, res){
        const {valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body
    
        // if (!nome || !tipo_local || !saldo || !ativo) {
        //     return res.status(400).json({message: 'nome, tipo_local, saldo, ativo são obrigatórios'})
        // }

        try{
            const transacao = await BD.query(`INSERT INTO transacoes(valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) `,[valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])
            res.status(201).json("transação certo")

        }catch(error){
            console.error('Erro ao criar transacao', error);
            res.status(500).json({message: 'Erro ao criar transacao', error: error.message})
        }
    }
}

export default rotasTransacoes