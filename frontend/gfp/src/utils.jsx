import { MdDirectionsCar, MdFavorite, MdFitnessCenter, MdHome, MdPets, MdRestaurant, MdSchool, MdShoppingCart, MdSportsSoccer, MdWallet } from "react-icons/md";

// Endereso de servidor da API, alterar conforme necessário
export const enderecoServidor = 'http://localhost:3000'

export const listaCores = [
    '#f56464',
    '#FF7F50',
    '#FF5733',
    '#f5e964',
    '#FFC300',
    '#DAF7A6',
    '#79ed87',
    '#33FF57',
    '#69d9db',
    '#33FFF6',
    '#33A1FF',
    '#647ff5',
    '#8D33FF',
    '#fc65f5',
    '#FF33EC',
    '#FF33A1',
];

export const listaIcones = [
    'restaurant',
    'directions-car',
    'school',
    'home',
    'sports-soccer',
    'shopping-cart',
    'pets',
    'favorite',
    'fitness-center',
    'wallet'
];

export const iconesCategoria = {
    'restaurant': <MdRestaurant className="w-6 h-6" />,
    'directions-car': <MdDirectionsCar className="w-6 h-6" />,
    'school': <MdSchool className="w-6 h-6" />,
    'home': <MdHome className="w-6 h-6" />,
    'sports-soccer': <MdSportsSoccer className="w-6 h-6" />,
    'shopping-cart': <MdShoppingCart className="w-6 h-6" />,
    'pets': <MdPets className="w-6 h-6" />,
    'favorite': <MdFavorite className="w-6 h-6" />,
    'fitness-center': <MdFitnessCenter className="w-6 h-6" />,
    'wallet': <MdWallet className="w-6 h-6" />,
}