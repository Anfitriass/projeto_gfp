import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

export default function Principal({navigation}) {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState({})
    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const UsuarioLogado = await localStorage.getItem('UsuarioLogado')
            if (UsuarioLogado) {
                setUsuario(JSON.parse(UsuarioLogado))
            } else {
                navigate("/")
            }
        }
        buscarUsuarioLogado()
    }, [navigate])
    const botaoLogout = () => {
        localStorage.removeItem('UsuarioLogado')
        navigate("/")
    }

    return (
        <div>
            <div style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: '5px'}}>
                <p>Usuário: {usuario.nome}</p>
                <button onClick={botaoLogout}>Sair</button>
            </div>
            <h1>Principal</h1>
        </div>
    )
}