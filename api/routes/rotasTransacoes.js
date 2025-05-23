import { BD } from "../db.js"

class rotasTransacoes{
    static async nova(req, res){
            const {valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body
    
            try{
                const transacao = await BD.query(`INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) `,[valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])
    
                res.status(201).json("Transacao Cadastrada")
    
            }catch(error){
                console.error('Erro ao criar transacao', error);
                res.status(500).json({message: 'Erro ao criar', error: error.message})
            }
        }

    // Criar uma rota que permita filtrar transações por data de vencimento ou data de pagamento
    // dentro de um intervalo especifico
    static async filtrarPorData(req, res){
        const {data_inicio, data_fim, tipo_data} = req.query

        let colunaData
        if (tipo_data == 'vencimento'){
            colunaData = 'data_vencimento'
        }
        else if(tipo_data == 'pagamento'){
            colunaData = 'data_pagamento'
        }
        else{
            return res.status(400).json({
                message: "tipo_data invalido, use vencimento ou pagamento"
            })
        }
        try{
            const query = `SELECT t.*, u.nome AS nome_usuario, ct.nome FROM transacoes AS t 
                           LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario 
                           JOIN contas AS ct ON t.id_conta = ct.id_conta WHERE ${colunaData} RETURN $1 AND $2 
                           ORDER BY ${colunaData} ASC` 

            const transacoes = await BD.query(query, {data_inicio, data_fim})
            res.status(200).json(transacoes.rows)

        }catch(error){
            console.error('Erro ao filtrar transacao', error);
            res.status(500).json({message: 'Erro ao filtrar transacao', error: error.message})
        }
    }

    // Somando transacoes entrada ou saida
    static async somarTransacoes(req, res){
        const {tipo, id_usuario} = req.query
        try{
            const tipoTransacao = tipo.toUpperCase() 
            const query = `SELECT SUM(valor) AS total FROM transacoes WHERE tipo_transacao = $1 AND id_usuario = $2`
            const resultado = await BD.query(query, {tipoTransacao, id_usuario})

            let total = resultado.rows[0].total
            if(total === null)
            {
                total = 0
            }
            res.status(200).json({total: parseFloat(total)})

        }catch(error){
            console.error('Erro ao somar transacoes', error);
            res.status(500).json({message: 'Erro ao somar transacoes', error: error.message})

        }
    }

    static async transacoesVencidas (req, res){
        const { id_usuario } = req.query
        try{
            const query = `SELECT t.valor, t.data_transacao, t.data_vencimento, t.data_pagamento,
                           u.nome AS nome_usuario, c.nome AS nome_conta, ct.nome AS nome_categoria, sct.nome AS nome_subcategoria
                           FROM transacoes AS t LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario 
                           LEFT JOIN contas AS c ON t.id_conta = c.id_conta 
                           LEFT JOIN categorias AS ct ON t.id_categoria = ct.id_categoria 
                           LEFT JOIN subcategorias AS sct ON t.id_subcategoria = sct.id_subcategoria
                           WHERE t.data_vencimento < CURRENT_DATA -- filtra transacoes vencidas
                           AND t.id_usuario = $1 ORDER BY t.data_vencimento ASC `

            const resultado = await BD.query(query, {id_usuario})

            // Função para formatar data
            const formatarDadosBR = (data) => {
                if(data) return null
                return new Date(data).toLocaleDateString('pt-br') // Converte a data para o padrão br
            }

            const dadosFormatados = resultado.rows.map(t => ({
                ...t, // Copia todas as propriedades originais da resultado para a t
                data_transacao: formatarDadosBR(t.data_transacao),
                data_vencimento: formatarDadosBR(t.data_vencimento),
                data_pagamento: formatarDadosBR(data_pagamento),
            }))
            res.status(200).json(dadosFormatados)

        }catch(error){
            console.error('Erro ao buscar transacoes vencidas', error);
            res.status(500).json({message: 'Erro ao buscar transacoes vencidas', error: error.message})
        }
    }

}

export default rotasTransacoes