import { Text, View, Button } from 'react-native'
import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Principal({ navigation }) {

    const [usuario, setUsuario] = useState([])

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const UsuarioLogado = await AsyncStorage.getItem('UsuarioLogado')
            if (UsuarioLogado){
                setUsuario(JSON.parse(UsuarioLogado))
            } else {
                navigation.navigate('Login')
            }
        }

        buscarUsuarioLogado()
    }, [])

    const botaoLogout = () => {
        AsyncStorage.removeItem('UsuarioLogado')
        navigation.navigate('Login')
    }

    return (
        <View>
            {/* Coloca um na frente do outro👇 */}
            <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between'}} >
                <Text> Usuario: {usuario.nome} </Text>
                <Button title='Sair' onPress={botaoLogout} />
            </View>
            <Text>Principal</Text>
        </View>
    )
}