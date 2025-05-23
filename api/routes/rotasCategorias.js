import { BD } from "../db.js"
import bcrypt from "bcrypt"

class rotasCategorias{
    static async nova(req, res){
            const {nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone} = req.body
    
            try{
                const categoria = await BD.query(`INSERT INTO categorias(nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone) VALUES($1, $2, $3, $4, $5, $6) `,[nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone])
    
                res.status(201).json("Categoria Cadastrada")
    
            }catch(error){
                console.error('Erro ao criar categoria', error);
                res.status(500).json({message: 'Erro ao criar', error: error.message})
            }
        }

        static async listar(req, res){
            try{
                // const usuarios = await Usuario.listar() // Chamar o metodo listar na models usuario
                const categorias = await BD.query("SELECT * FROM categorias WHERE ativo = true")
                return res.status(200).json(categorias.rows) // Retorna a lista de usuarios
            }catch(error){
                res.status(500).json({message:'Erro ao listar categorias', error: error.message})
            }
        }

        static async listarPorID(req, res){
            const { id_categoria } = req.params;
            try{
                const categoria = await BD.query('SELECT * FROM categorias WHERE id_categoria = $1', [id_categoria])
            res.status(200).json(categoria.rows);
            }catch(error){
                res.status(500).json({message: "Erro ao consultar categoria", error: error.message})
            }
        }

        static async atualizar (req, res){
                const  {id_categoria}  = req.params
                const {nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone} = req.body
        
                try{
                    // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
                    const campos = [];
                    const valores = [];
        
                    // Verificar quais campos foram fornecidos
                    if(nome !== undefined){
                        campos.push(`nome = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                        valores.push(nome);
                    }
        
                    if( tipo_transacao !== undefined){
                        campos.push(`tipo_transacao = $${valores.length + 1}`)
                        valores.push(tipo_transacao);
                    }
        
                    if( gasto_fixo !== undefined){
                        campos.push(`gasto_fixo = $${valores.length + 1}`)
                        valores.push(gasto_fixo);
                    }
        
                    if( id_usuario !== undefined){
                        campos.push(`id_usuario = $${valores.length + 1}`)
                        valores.push(id_usuario);
                    }
        
                    if( cor !== undefined){
                        campos.push(`cor = $${valores.length + 1}`)
                        valores.push(cor);
                    }
        
                    if( icone !== undefined){
                        campos.push(`icone = $${valores.length + 1}`)
                        valores.push(icone);
                    }
        
        
                    if(campos.length === 0){
                        return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
                    }
        
        
                    // Montamos a query dinamicamente
                    const query = `UPDATE categorias SET ${campos.join(', ')}  WHERE id_categoria = ${id_categoria} RETURNING * `
                    // Executando nossa query
                    const categoria = await BD.query(query, valores)
        
                    // Verifica se o categoria foi atualizado
                    if(categoria.rows.length === 0){
                        return res.status(404).json({message: 'Categoria não encontrado'})
                    }
        
                    return res.status(200).json(categoria.rows[0])
        
                }catch(error){
                    res.status(500).json({message: "Erro ao atualizar categoria", error: error.message})
                }
            }

            static async atualizarTodos(req, res){
                const {id_categoria} = req.params
                const {nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone} = req.body
        
                try{
                    const categoria = await BD.query('UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, id_usuario = $4, cor = $5, icone = $6 WHERE id_categoria = $7 RETURNING *',
                        [nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone, id_categoria] // Comando SQL para atualizar o usuario
                    )
                    res.status(200).json(categoria.rows)
                }catch(error){
                    res.status(500).json({message: "Erro ao atualizar categoria", error: error.message})
                }
            }

            static async deletar(req, res){
                const { id_categoria } = req.params
                try{
                    const categoria = await BD.query('UPDATE categorias SET ativo = false WHERE id_categoria = $1', [id_categoria])
                    return res.status(200).json({message: "Categoria deletado com sucesso"})
                }catch(error){
                    res.status(500).json({message:"Erro ao deletar categoria", error:error.message})
                }
            }

            // Filtrar por tipo de categoria
            static async filtrarCategoria(req, res){
               const {tipo_transacao} = req.query;
               try{
                    const query = `SELECT * FROM categorias WHERE tipo_transacao = $1 AND ativo = true ORDER BY nome DESC`

                    const valores = [tipo_transacao]
                    const resposta = await BD.query(query, valores)
                    return res.status(200).json(resposta.rows)

               }catch(error){
                    console.error('Erro ao filtrar categoria', error)
                    res.status(500).json({message: 'Erro ao filtrar categorias', error: error.message})
               }
            }
}

export default rotasCategorias
