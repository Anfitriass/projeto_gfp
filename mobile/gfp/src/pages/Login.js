import { View, Text, Button } from 'react-native'

export default function Login({navigation}) {
    return (
        <div>
            <Text>Login</Text>
            <Button title='Entrar' onPress={() => navigation.navigate('MenuDrawer')} />
        </div>
    )
  }