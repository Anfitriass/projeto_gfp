import { BD } from "../db.js"

class rotasSubCategorias{
    static async nova(req, res){
            const {nome, id_categoria, gasto_fixo, cor, icone} = req.body
    
            try{
                const subCategoria = await BD.query(`INSERT INTO subcategorias(nome, id_categoria, gasto_fixo, cor, icone) VALUES($1, $2, $3, $4, $5) `,[nome, id_categoria, gasto_fixo, cor, icone])
    
                res.status(201).json("Sub Categoria Cadastrado")
    
            }catch(error){
                console.error('Erro ao criar sub categoria', error);
                res.status(500).json({message: 'Erro ao criar', error: error.message})
            }
        }

        static async listar(req, res){
            try{
                // const usuarios = await Usuario.listar() // Chamar o metodo listar na models usuario
                const subCategorias = await BD.query("SELECT * FROM subcategorias WHERE ativo = true")
                return res.status(200).json(subCategorias.rows) // Retorna a lista de usuarios
            }catch(error){
                res.status(500).json({message:'Erro ao listar sub categorias', error: error.message})
            }
        }

        static async listarPorID(req, res){
        const { id_subcategoria } = req.params;
        try{
            const subCategoria = await BD.query('SELECT * FROM subcategorias WHERE id_categoria = $1 and ativo = true', [id_subcategoria])
        res.status(200).json(subCategoria.rows);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar sub categoria", error: error.message})
        }
    }

        static async atualizar (req, res){
                const  {id_subcategoria}  = req.params
                const {nome, id_categoria, gasto_fixo, cor, icone} = req.body
        
                try{
                    // Inicializar arrays(vetores) para armazenar os campos e valores que seram atualizados
                    const campos = [];
                    const valores = [];
        
                    // Verificar quais campos foram fornecidos
                    if(nome !== undefined){
                        campos.push(`nome = $${valores.length + 1}`) // Usa o tamanho da array para determinar o campo
                        valores.push(nome);
                    }
        
                    if( id_categoria !== undefined){
                        campos.push(`id_categoria = $${valores.length + 1}`)
                        valores.push(id_categoria);
                    }
        
                    if( gasto_fixo !== undefined){
                        campos.push(`gasto_fixo = $${valores.length + 1}`)
                        valores.push(gasto_fixo);
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
                    const query = `UPDATE subcategorias SET ${campos.join(', ')}  WHERE id_subcategoria = ${id_subcategoria} RETURNING * `
                    // Executando nossa query
                    const subCategoria = await BD.query(query, valores)
        
                    // Verifica se o usuario foi atualizado
                    if(subCategoria.rows.length === 0){
                        return res.status(404).json({message: 'Sub categoria não encontrada'})
                    }
        
                    return res.status(200).json(subCategoria.rows[0])
        
                }catch(error){
                    res.status(500).json({message: "Erro ao atualizar sub categoria", error: error.message})
                }
            }

            static async atualizarTodos(req, res){
                const { id_subcategoria } = req.params
                const {nome, id_categoria, gasto_fixo, cor, icone} = req.body
        
                try{
                    const categoria = await BD.query('UPDATE subCategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3, cor = $4, icone = $5 WHERE id_subcategoria = $6 RETURNING *',
                        [ nome, id_categoria, gasto_fixo, cor, icone, id_subcategoria] // Comando SQL para atualizar o usuario
                    )
                    res.status(200).json(categoria.rows)
                }catch(error){
                    res.status(500).json({message: "Erro ao atualizar subcategoria", error: error.message})
                }
            }

            static async deletar(req, res){
                const { id_subcategoria } = req.params
                try{
                    const subCategoria = await BD.query('UPDATE subCategorias SET ativo = false WHERE id_subcategoria = $1', [id_subcategoria])
                    return res.status(200).json({message: "Subcategoria deletado com sucesso"})
                }catch(error){
                    res.status(500).json({message:"Erro ao deletar subcategoria", error:error.message})
                }
            }

}

export default rotasSubCategorias