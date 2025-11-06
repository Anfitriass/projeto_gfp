import { BD } from "../db.js"

class rotasTransacoes {
    static async nova(req, res) {
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body

        try {
            const transacao = await BD.query(`INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) `, [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])

            res.status(201).json("Transacao Cadastrada")

        } catch (error) {
            console.error('Erro ao criar transacao', error);
            res.status(500).json({ message: 'Erro ao criar', error: error.message })
        }
    }

    static async dadosDashboard(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;

            // Query para os Indicadores (KPIs)
            const kpisQuery = `
        SELECT
          COALESCE(SUM(CASE WHEN tipo_transacao = 'ENTRADA' THEN valor ELSE 0 END), 0) as receitas,
          COALESCE(SUM(CASE WHEN tipo_transacao = 'SAIDA' THEN valor ELSE 0 END), 0) as despesas
        FROM transacoes
        WHERE data_vencimento BETWEEN $1 AND $2
      `

            // Query para o Gráfico de Categorias
            const categoriasQuery = ` 
        SELECT c.nome, SUM(t.valor)::float as valor
        FROM transacoes as t 
          INNER JOIN categorias as c ON t.id_categoria = c.id_categoria
        WHERE t.data_vencimento BETWEEN $1 AND $2
        GROUP BY c.nome
        ORDER BY valor DESC
      `

            // Query para o Gráfico de Categorias
            const subcategoriasQuery = ` 
        SELECT s.nome, SUM(t.valor)::float as valor
        FROM transacoes as t 
          INNER JOIN subcategorias as s ON t.id_subcategoria = s.id_subcategoria
        WHERE t.data_vencimento BETWEEN $1 AND $2
        GROUP BY s.nome
        ORDER BY valor DESC
      `

            // Query para a listagem de últimos vencimentos
            const vencimentoQuery = `
        SELECT t.valor, t.data_vencimento, t.descricao, sct.nome AS nome_subcategoria, ct.icone, ct.cor
            FROM transacoes AS t 
            	JOIN categorias ct on t.id_categoria = ct.id_categoria
            	JOIN subcategorias sct on t.id_subcategoria = sct.id_subcategoria
            WHERE t.data_vencimento BETWEEN $1 AND $2 AND t.data_pagamento IS NULL
            ORDER BY t.data_vencimento 
      `

            const evolucao6mesesQuery = `
        SELECT
            TO_CHAR(t.data_vencimento, 'MM/YYYY') AS mes,
            SUM(CASE WHEN t.tipo_transacao = 'ENTRADA' THEN t.valor ELSE 0 END) AS total_receitas,
            SUM(CASE WHEN t.tipo_transacao = 'SAIDA' THEN t.valor ELSE 0 END) AS total_despesas
        FROM transacoes AS t
        JOIN categorias ct ON t.id_categoria = ct.id_categoria
        JOIN subcategorias sct ON t.id_subcategoria = sct.id_subcategoria
        WHERE 
            t.data_vencimento >= (CURRENT_DATE - INTERVAL '6 months')
        GROUP BY TO_CHAR(t.data_vencimento, 'MM/YYYY')
        ORDER BY TO_DATE(TO_CHAR(t.data_vencimento, 'MM/YYYY'), 'MM/YYYY');
      `

            // const kpis = await BD.query(kpisQuery, [dataInicio, dataFim]);
            // const categorias = await BD.query(categoriasQuery, [dataInicio, dataFim]);
            // const subcategorias = await BD.query(subcategoriasQuery, [dataInicio, dataFim]);
            // const vencimentos = await BD.query(vencimentoQuery, [dataInicio, dataFim]);
            // const evolucao6meses = await BD.query(evolucao6mesesQuery);

            //Executando todas as queries em paralelo para otimizar
            const [kpis, categorias, subcategorias, vencimentos, evolucao6meses] = await Promise.all(
                [
                    BD.query(kpisQuery, [dataInicio, dataFim]),
                    BD.query(categoriasQuery, [dataInicio, dataFim]),
                    BD.query(subcategoriasQuery, [dataInicio, dataFim]),
                    BD.query(vencimentoQuery, [dataInicio, dataFim]),
                    BD.query(evolucao6mesesQuery),
                ]);

            res.status(200).json({
                kpis: kpis.rows[0],
                categorias: categorias.rows,
                subcategorias: subcategorias.rows,
                vencimentos: vencimentos.rows,
                evolucao6meses: evolucao6meses.rows
            })

        } catch (error) {
            console.error("Erro ao listar dados:", error);
            res.status(500).json({ message: "Erro ao listar dados", error: error.message });
        }
    }

    // Criar uma rota que permita filtrar transações por data de vencimento ou data de pagamento
    // dentro de um intervalo especifico
    static async filtrarPorData(req, res) {
        const { data_inicio, data_fim, tipo_data } = req.query

        let colunaData
        if (tipo_data == 'vencimento') {
            colunaData = 'data_vencimento'
        }
        else if (tipo_data == 'pagamento') {
            colunaData = 'data_pagamento'
        }
        else {
            return res.status(400).json({
                message: "tipo_data invalido, use vencimento ou pagamento"
            })
        }
        try {
            const query = `SELECT t.*, u.nome AS nome_usuario, ct.nome FROM transacoes AS t 
                           LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario 
                           JOIN contas AS ct ON t.id_conta = ct.id_conta WHERE ${colunaData} RETURN $1 AND $2 
                           ORDER BY ${colunaData} ASC`

            const transacoes = await BD.query(query, { data_inicio, data_fim })
            res.status(200).json(transacoes.rows)

        } catch (error) {
            console.error('Erro ao filtrar transacao', error);
            res.status(500).json({ message: 'Erro ao filtrar transacao', error: error.message })
        }
    }

    // Somando transacoes entrada ou saida
    static async somarTransacoes(req, res) {
        const { tipo, id_usuario } = req.query
        try {
            const tipoTransacao = tipo.toUpperCase()
            const query = `SELECT SUM(valor) AS total FROM transacoes WHERE tipo_transacao = $1 AND id_usuario = $2`
            const resultado = await BD.query(query, { tipoTransacao, id_usuario })

            let total = resultado.rows[0].total
            if (total === null) {
                total = 0
            }
            res.status(200).json({ total: parseFloat(total) })

        } catch (error) {
            console.error('Erro ao somar transacoes', error);
            res.status(500).json({ message: 'Erro ao somar transacoes', error: error.message })

        }
    }

    static async transacoesVencidas(req, res) {
        const { id_usuario } = req.query
        try {
            const query = `SELECT t.valor, t.data_transacao, t.data_vencimento, t.data_pagamento,
                           u.nome AS nome_usuario, c.nome AS nome_conta, ct.nome AS nome_categoria, sct.nome AS nome_subcategoria
                           FROM transacoes AS t LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario 
                           LEFT JOIN contas AS c ON t.id_conta = c.id_conta 
                           LEFT JOIN categorias AS ct ON t.id_categoria = ct.id_categoria 
                           LEFT JOIN subcategorias AS sct ON t.id_subcategoria = sct.id_subcategoria
                           WHERE t.data_vencimento < CURRENT_DATA -- filtra transacoes vencidas
                           AND t.id_usuario = $1 ORDER BY t.data_vencimento ASC `

            const resultado = await BD.query(query, { id_usuario })

            // Função para formatar data
            const formatarDadosBR = (data) => {
                if (data) return null
                return new Date(data).toLocaleDateString('pt-br') // Converte a data para o padrão br
            }

            const dadosFormatados = resultado.rows.map(t => ({
                ...t, // Copia todas as propriedades originais da resultado para a t
                data_transacao: formatarDadosBR(t.data_transacao),
                data_vencimento: formatarDadosBR(t.data_vencimento),
                data_pagamento: formatarDadosBR(data_pagamento),
            }))
            res.status(200).json(dadosFormatados)

        } catch (error) {
            console.error('Erro ao buscar transacoes vencidas', error);
            res.status(500).json({ message: 'Erro ao buscar transacoes vencidas', error: error.message })
        }
    }

    static async listar(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;

            // const usuarios = await Usuario.listar() // Chamar o metodo listar na models usuario
            const transacoes = await BD.query(`
                SELECT t.*, u.nome AS nome_usuario, lt.nome AS nome_conta, ct.nome AS nome_categoria, sct.nome AS nome_subcategoria, ct.cor, ct.icone 
                FROM transacoes AS t 
                LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario 
                    JOIN contas lt on t.id_conta = lt.id_conta
                    JOIN categorias ct on t.id_categoria = ct.id_categoria
                    JOIN subcategorias sct on t.id_subcategoria = sct.id_subcategoria
                WHERE t.data_vencimento BETWEEN $1 AND $2
                ORDER BY t.data_vencimento`, [dataInicio, dataFim]);
            return res.status(200).json(transacoes.rows) // Retorna a lista de usuarios
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message })
        }
    }

    static async listarTransacao(req, res) {
        try {
            // Obtendo as datas enviadas no parametro do URL
            const { dataInicio, dataFim } = req.query;

            const transacoes = await BD.query(`
            SELECT t. *, u.nome AS nome_usuario, lt.nome AS nome_conta, ct.nome AS nome_categoria, sct.nome AS nome_subcategoria, ct.icone, ct.cor
              FROM transacoes AS t
              LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
              INNER JOIN contas lt on t.id_conta = lt.id_conta
              INNER JOIN categorias ct on t.id_categoria = ct.id_categoria
              INNER JOIN subcategorias sct on t.id_subcategoria = sct.id_subcategoria
              WHERE t.data_vencimento BETWEEN $1 AND $2
            ORDER BY t.data_vencimento DESC`, [dataInicio, dataFim]);
            res.status(200).json(transacoes.rows);
        } catch (error) {
            console.error("Erro ao listar locais:", error);
            res.status(500).json({ message: "Erro ao listar locais", error: error.message });
        }
    }

    static async atualizar(req, res) {
        const { id_transacao } = req.params
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body

        try {
            // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
            const campos = [];
            const valores = [];

            // Verificar quais campos foram fornecidos
            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                valores.push(valor);
            }

            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao);
            }

            if (data_transacao !== undefined) {
                campos.push(`data_transacao = $${valores.length + 1}`)
                valores.push(data_transacao);
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento);
            }

            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento);
            }

            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao);
            }

            if (id_conta !== undefined) {
                campos.push(`id_conta = $${valores.length + 1}`)
                valores.push(id_conta);
            }

            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria);
            }

            if (id_subcategoria !== undefined) {
                campos.push(`id_subcategoria = $${valores.length + 1}`)
                valores.push(id_subcategoria);
            }

            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`)
                valores.push(id_usuario);
            }

            if (num_parcelas !== undefined) {
                campos.push(`num_parcelas = $${valores.length + 1}`)
                valores.push(num_parcelas);
            }

            if (parcela_atual !== undefined) {
                campos.push(`parcela_atual = $${valores.length + 1}`)
                valores.push(parcela_atual);
            }


            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualização' })
            }


            // Montamos a query dinamicamente
            const query = `UPDATE transacoes SET ${campos.join(', ')}  WHERE id_transacao = ${id_transacao} RETURNING * `
            // Executando nossa query
            const transacao = await BD.query(query, valores)

            // Verifica se o categoria foi atualizado
            if (transacao.rows.length === 0) {
                return res.status(404).json({ message: 'transação não encontrado' })
            }

            return res.status(200).json(transacao.rows[0])

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar transação", error: error.message })
        }
    }

    static async atualizarTodosCampos(req, res) {
        const { id } = req.params;
        const { valor,
            descricao,
            data_transacao,
            data_vencimento,
            data_pagamento,
            tipo_transacao,
            id_local_transacao,
            id_categoria,
            id_subcategoria,
            id_usuario,
            num_parcelas,
            parcela_atual } = req.body;
        try {
            const transacao = await BD.query(
                `UPDATE transacoes SET valor = $1
                 descricao = $2,
                  data_transacao = $3,
                   data_vencimento = $4,
                    data_pagamento = $5,
                     tipo_transacao = $6,
                      id_local_transacao = $7,
                       id_categoria = $8,
                        id_subcategoria = $9,
                         id_usuario = $10,
                         num_parcelas = $11,
                          parcela_atual = $12   WHERE id_transacao = $13 RETURNING *`, // comando para atualizar o usuario
                [valor,
                    descricao,
                    data_transacao,
                    data_vencimento,
                    data_pagamento,
                    tipo_transacao,
                    id_local_transacao,
                    id_categoria,
                    id_subcategoria,
                    id_usuario,
                    num_parcelas,
                    parcela_atual, id] // comando para atualizar o usuario
            )
            return res.status(200).json(transacao.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar transação:", error);
            res.status(500).json({ message: "Erro ao atualizar transação", error: error.message });
        }
    }

    static async deletar(req, res) {
        const { id_transacao } = req.params
        try {
            const transacao = await BD.query('UPDATE transacao SET ativo = false WHERE id_transacao = $1', [id_transacao])
            return res.status(200).json({ message: "Transacao deletada com sucesso" })
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar usuario", error: error.message })
        }
    }

}

export default rotasTransacoes