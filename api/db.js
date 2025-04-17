import pkg from 'pg';
import dotenv from 'dotenv'

const { Pool } = pkg;
dotenv.config()

// const BD = new Pool({
//     ConnectionString: process.env.DATABASE_URL
// })

const BD = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'bd_gfp',
    password: 'admin',
    port: 5432,
})

const testarConexao = async () => {
    try{
        const client = await BD.connect(); // Tentar estabelecer a conexão com o banco de dados
        console.log(" Conexão com o banco de dados estabelecidos");
        client.release(); // Libera o client
    }catch(error){
        console.log("Erro ao conectar ao banco de dados", error.message);
    }
}

export {BD, testarConexao}