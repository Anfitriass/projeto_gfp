import { BorderlessButton } from "react-native-gesture-handler";

export const corPrincipal = '#ffcc00';
export const corSecundaria = '#ffa200';
export const corTextos = '#f2f2f2';
export const corTextos2 = '#999';
export const corPreto = '#222';
export const corFundo = '#0d0d0d';
export const corFundo2 = '#262626';
export const corBorda = '#262626';


const Estilos = {
    conteudo : {
        flex : 1,
        width : '100%',
        backgroundColor: corFundo
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f4f6f8',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 45,
        fontSize: 16,
        color: corPreto,
        borderWidth: 1,
        borderColor: corBorda,
    },
    inputActive: {
        borderColor: corPrincipal,
        backgroundColor: '#bf00ff',
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
    },
    botao: {
        width: '100%',
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    degradeBotao: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoTexto: {
        color: corTextos,
        fontSize: 16,
        fontWeight: 'bold',
    },
    conteudoHeader: {
        flex: 1,
        backgroundColor: '#d900ff',
    },
    conteudoCorpo:{
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 15,
    },
    imagemLista:{
        width: 35,
        height: 35,
        marginRight: 10,
    },
    itemLista:{
        flexDirection: 'row',
        alignItems: 'center',
        borderButtonWidth: 1,
        borderButtonColor: '#fff',
        paddingVertical: 7,
    },
    textContainer:{
        flex: 1,
    },
    nomeLista:{
        fontSize: 16,
        fontWeight: 'bold',
        color: corSecundaria,
    },
    inputCad:{
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff'
    },
    modalFundo:{
        flex:1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
    },
    modalConteudo:{
        backgroundColor: '#d900ff',
        padding: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    modalTitulo:{
        fontSize: 18,
        color: '#fff',
        marginBottom: 16
    },
    inputModal:{
        backgroundColor: '#f6defa',
        flex: 1,
        padding: 8,
        borderRadius: 8
    },
    modalBotoes:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    corBotao:{
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8,
        borderWidth: 2,
        borderColor: '#fff'
    },
    iconeBotao: {
        width: 40,
        height: 40,
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    SeletorContainer:{
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    listaModal:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8
    }
    
    
    
}

export default Estilos;