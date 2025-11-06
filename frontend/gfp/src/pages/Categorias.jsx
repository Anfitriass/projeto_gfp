import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { enderecoServidor, iconesCategoria } from '../utils';
import { MdAdd, MdEdit, MdDelete, MdExpandMore, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Estilos from '../styles/Estilos';
import CategoriasModal from "./CategoriasModal";
import SubCategorias from "./SubCategorias";

export default function Categorias() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    // Novo status para a subCategoria
    const [categoriaAbertaId, setCategoriaAbertaId] = useState(null);
    const [subCategoriaLista, setSubCategoriaLista] = useState([]);
    const [subCategoriaModalAberto, setSubCategoriaModalAberto] = useState(false);
    const [subCategoriaItemAlterar, setSubCategoriaItemAlterar] = useState(null);

    // Variaveis para o controle do modal
    const [modalAberto, setModalAberto] = useState(false)
    const [itemAlterar, setItemAlterar] = useState(null)

    const fecharModal = () => {
        setModalAberto(false)
        setItemAlterar(false)
        buscarDadosAPI()
    }

    const fecharModalSubcategoria = () => {
        setSubCategoriaModalAberto(false)
        setSubCategoriaItemAlterar(null)
        if (categoriaAbertaId != null) {
            buscarDadosSubCategoriasAPI(categoriaAbertaId)
        }
    }

    const botaoAlterar = (item) => {
        setItemAlterar(item)
        setModalAberto(true)
    }

    const navigate = useNavigate();

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET', headers: { 'Authorization': `Bearer ${dadosUsuario.token}` }
            })
            const dados = await resposta.json()
            setDadosLista(dados)
            console.log('dados', dados);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);

        }
    }

    useEffect(() => {
        if (!carregando || dadosUsuario) {
            buscarDadosAPI()
        }
    }, [dadosUsuario])

    const botaoExcluir = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir essa categoria?")) return
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${dadosUsuario.token}` }
            })

            if (resposta.ok) {
                buscarDadosAPI()
            }

        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirItemLista = (item) => {
        const estaAberta = categoriaAbertaId == item.id_categoria

        return (
            <section key={item.id_categoria}>
                <div className={Estilos.linhaListagem} onClick={() => exibirListagemSubCategorias(item.id_categoria)} >
                    <div className="p-2 text-white rounded-full" style={{ backgroundColor: item.cor }} >
                        {iconesCategoria[item.icone]}
                    </div>
                    <div className="flex-1 ml-4" >
                        <p className="font-bold text-gray-800" > {item.nome} </p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.tipo_transacao == 'SAIDA' ? 'bg-orange-200 text-orange-800' : 'bg-cyan-200 text-cyan-800'}`} >
                            {item.tipo_transacao}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2" >
                        {estaAberta ? <MdExpandMore className="h-7 w-7 text-gray-500" /> : <MdChevronRight className="h-7 w-7 text-gray-500" />}

                        <button className={Estilos.botaoAlterar} onClick={() => botaoAlterar(item)} ><MdEdit className="w-6 h-6" /> </button>
                        <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_categoria)} ><MdDelete className="w-6 h-6" /></button>
                    </div>
                </div>
                {/* Exibindo listagem das subCategorias */}
                {estaAberta ? exibirSubCategorias(item) : null}
            </section>
        )
    }

    // Funções para subCategoria
    const exibirListagemSubCategorias = (id) => {
        if (categoriaAbertaId == id) {
            setCategoriaAbertaId(null)
        } else {
            setCategoriaAbertaId(id)
            buscarDadosSubCategoriasAPI(id)
        }
    }

    const buscarDadosSubCategoriasAPI = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/subCategorias/${id}`, {
                method: 'GET', headers: { 'Authorization': `Bearer ${dadosUsuario.token}` }
            })
            const dados = await resposta.json()
            setSubCategoriaLista(dados)
            console.log('dados', dados);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);

        }
    }

    const botaoNovaSubcategoria = () => {
        setSubCategoriaItemAlterar(null)
        setSubCategoriaModalAberto(true)
    }

    const botaoAlterarSubcategoria = (item) => {
        setSubCategoriaItemAlterar(item)
        setSubCategoriaModalAberto(true)
    }

    const botaoExcluirSubcategoria = async (id) => {
        try {
            if (!window.confirm("Tem certeza que deseja excluir essa subcategoria?")) return
            const resposta = await fetch(`${enderecoServidor}/subCategorias/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${dadosUsuario.token}` }
            })

            if (resposta.ok) buscarDadosSubCategoriasAPI(categoriaAbertaId)


        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirSubCategorias = (categoria) => {
        return (
            <div className="bg-gray-50 p-4 mt-2 ml-10 rounded-lg border border-gray-200" >
                <div className="flex justify-between items-center mb-3" >
                    <h4 className="font-bold text-gray-700" >Subcategorias de  {categoria.nome} </h4>
                    <button className="bg-cyan-500 px-3 py-1 rounded-md flex items-center" onClick={botaoNovaSubcategoria} >
                        <MdAdd className="h-5 w-5 mr-1" /> Nova subcategoria
                    </button>
                </div>

                {subCategoriaLista.length == 0 ? <p className="text-gray-400" >Nenhuma subcategoria cadastrada</p> : null}

                <div className="space-y-2" >
                    {subCategoriaLista.map(subcategoria => (
                        <div key={subcategoria.id_subcategoria} className="flex justify-between p-2 bg-white rounded shadow-sm" >
                            <p className="text-gray-800"> {subcategoria.nome} </p>
                            <div className="flex items-center space-x-2" >
                                <button className={Estilos.botaoAlterar} onClick={() => botaoAlterarSubcategoria(subcategoria)} ><MdEdit className="w-6 h-6" /> </button>
                                <button className={Estilos.botaoExcluir} onClick={() => botaoExcluirSubcategoria(subcategoria.id_subcategoria)} ><MdDelete className="w-6 h-6" /></button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        )
    }

    return (
        <div>
            <p className='text-3xl font-bold mb-6'>Categorias🐾</p>
            <section className="bg-white/ p-4 rounded-lg shadow-md" >
                <div className="flex justify-between items-center mb-4" >
                    <h3 className="text-xl font-bold text-black" >Gerenciar Categorias</h3>
                    <button onClick={() => setModalAberto(true)} className={Estilos.botaoCadastro} >
                        <MdAdd className="w-8 h-8" /> Nova categoria
                    </button>
                </div>
                {/* Lista das contas cadastradas */}
                <section className="">
                    {dadosLista.map(item => exibirItemLista(item))}
                </section>
            </section>

            <CategoriasModal
                modalAberto={modalAberto}
                fecharModal={fecharModal}
                itemAlterar={itemAlterar}
            />

            <CategoriasModal
                modalAberto={modalAberto}
                fecharModal={fecharModal}
                itemAlterar={itemAlterar}
            />

            <SubCategorias
                modalAberto={subCategoriaModalAberto}
                fecharModal={fecharModalSubcategoria}
                itemAlterar={subCategoriaItemAlterar}
                categoriaPai={categoriaAbertaId}
            />

        </div>
    )
}