import { createDrawerNavigator } from "@react-navigation/drawer"
import { BackHandler } from "react-native"
import Principal from "./Principal"
import Contas from "./Contas"
import Categorias from "./Categorias"
import Transacoes from "./Transacoes"

const Drawer = createDrawerNavigator()

export default function MenuDrawer(){
    return(
        <Drawer.Navigator
        screenOptions={{
                headerStyle:{
                    backgroundColor: '#cc00ff' ,
                    elevation: 0
                },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen name="Principal" component={Principal} />
            <Drawer.Screen name="Transações" component={Transacoes} />
            <Drawer.Screen name="Contas" component={Contas} />
            <Drawer.Screen name="Categorias" component={Categorias} />
        </Drawer.Navigator>
    )
}