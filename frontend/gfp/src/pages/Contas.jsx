import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { enderecoServidor } from '../utils';
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAutoGraph } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Estilos from '../styles/Estilos';

export default function Contas() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    const navigate = useNavigate();

    const iconesTipoConta = {
        'CONTA_CORRENTE': <MdAccountBalance className="w-6 h-6" />,
        'POUPANCA': <MdEmail className="w-6 h-6" />,
        'CARTAO_CREDITO': <MdCreditCard className="w-6 h-6" />,
        'CARTAO_DEBITO': <MdFeaturedPlayList className="w-6 h-6" />,
        'DINHEIRO': <MdAttachMoney className="w-6 h-6" />,
        'INVESTIMENTO': <MdAutoGraph className="w-6 h-6" />,
    }

    const nomesTipoConta = {
        'CONTA_CORRENTE': 'Conta Crrente',
        'POUPANCA': 'Poupança',
        'CARTAO_CREDITO': 'Cartão de Crédito',
        'CARTAO_DEBITO': 'Cartão de Debito',
        'DINHEIRO': 'Dinheiro',
        'INVESTIMENTO': 'Investimento',
    }

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas`, {
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
            if (!window.confirm("Tem certeza que deseja excluir essa conta?")) return
            const resposta = await fetch(`${enderecoServidor}/contas/${id}`, {
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
        return (
            <div key={item.id} className={Estilos.linhaListagem} >
                <div className="p-2 bg-purple-100 text-amber-600 rounded-full" >
                    {iconesTipoConta[item.tipo_conta]}
                </div>
                <div className="flex-1 ml-4" >
                    <p className="font-bold text-gray-800" > {item.nome} </p>
                    <p className="text-sm text-gray-500" > {nomesTipoConta[item.tipo_conta]} </p>
                </div>
                <div className="flex items-center space-x-2" >
                    <button className={Estilos.botaoAlterar} onClick={() => navigate('/cadcontas', { state: { itemAltrar:item } })} ><MdEdit className="w-6 h-6" /> </button>
                    <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_conta)} ><MdDelete className="w-6 h-6" /></button>
                </div>
            </div>
        )
    }


    return (
        <div>
            <p className='text-3xl font-bold mb-6'>Contas🐕</p>
            <section className="bg-white/ p-4 rounded-lg shadow-md" >
                <div className="flex justify-between items-center mb-4" >
                    <h3 className="text-xl font-bold text-black" >Gerenciar Contas</h3>
                    <button onClick={() => navigate('/cadcontas')} className={Estilos.botaoCadastro} >
                        <MdAdd className="w-8 h-8" /> Nova conta
                    </button>
                </div>
                {/* Lista das contas cadastradas */}
                <section className="">
                    {dadosLista.map(item => exibirItemLista(item))}
                </section>
            </section>
        </div>
    )
}