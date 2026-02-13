import { supabase } from '../supabaseClient';

const MOCK_PRICES = [
    // Elétrica
    { id: 101, category: 'Elétrica', name: 'Troca de Chuveiro Simples', min: 90, max: 150 },
    { id: 102, category: 'Elétrica', name: 'Troca de Chuveiro Elétrico/Eletrônico', min: 120, max: 180 },
    { id: 103, category: 'Elétrica', name: 'Troca de Resistência', min: 60, max: 90 },
    { id: 104, category: 'Elétrica', name: 'Instalação de Tomada/Interruptor', min: 50, max: 80 },
    { id: 105, category: 'Elétrica', name: 'Troca de Disjuntor', min: 80, max: 120 },
    { id: 106, category: 'Elétrica', name: 'Instalação de Luminária/Lustre Simples', min: 90, max: 150 },
    { id: 107, category: 'Elétrica', name: 'Instalação de Ventilador de Teto', min: 150, max: 250 },
    { id: 108, category: 'Elétrica', name: 'Instalação de Sensor de Presença', min: 80, max: 120 },
    { id: 109, category: 'Elétrica', name: 'Extensão de Ponto de Tomada (ext)', min: 120, max: 200 },

    // Hidráulica
    { id: 201, category: 'Hidráulica', name: 'Troca de Torneira Simples', min: 70, max: 100 },
    { id: 202, category: 'Hidráulica', name: 'Troca de Torneira Gourmet/Misturador', min: 120, max: 200 },
    { id: 203, category: 'Hidráulica', name: 'Troca de Sifão', min: 70, max: 100 },
    { id: 204, category: 'Hidráulica', name: 'Reparo em Caixa Acoplada', min: 100, max: 150 },
    { id: 205, category: 'Hidráulica', name: 'Instalação de Vaso Sanitário', min: 180, max: 300 },
    { id: 206, category: 'Hidráulica', name: 'Instalação de Máquina de Lavar', min: 100, max: 160 },
    { id: 207, category: 'Hidráulica', name: 'Troca de Reparo de Registro', min: 120, max: 180 },
    { id: 208, category: 'Hidráulica', name: 'Desentupimento de Pia/Ralo (Simples)', min: 150, max: 250 },
    { id: 209, category: 'Hidráulica', name: 'Limpeza de Caixa d\'água (até 1000L)', min: 250, max: 400 },

    // Montagem de Móveis
    { id: 301, category: 'Montagem', name: 'Montagem de Guarda-Roupa (3 portas)', min: 250, max: 400 },
    { id: 302, category: 'Montagem', name: 'Montagem de Guarda-Roupa (6 portas)', min: 400, max: 600 },
    { id: 303, category: 'Montagem', name: 'Montagem de Mesa de Jantar c/ Cadeiras', min: 150, max: 250 },
    { id: 304, category: 'Montagem', name: 'Montagem de Rack/Painel de TV', min: 120, max: 250 },
    { id: 305, category: 'Montagem', name: 'Montagem de Cômoda/Gaveteiro', min: 120, max: 200 },
    { id: 306, category: 'Montagem', name: 'Montagem de Cama de Casal/Box', min: 100, max: 180 },
    { id: 307, category: 'Montagem', name: 'Montagem de Armário de Cozinha (Módulo)', min: 80, max: 150 },

    // Instalações Diversas
    { id: 401, category: 'Diversos', name: 'Instalação de Suporte de TV', min: 100, max: 180 },
    { id: 402, category: 'Diversos', name: 'Instalação de Cortina/Persiana', min: 80, max: 150 },
    { id: 403, category: 'Diversos', name: 'Instalação de Varal de Teto', min: 100, max: 160 },
    { id: 404, category: 'Diversos', name: 'Instalação de Prateleira/Nicho (und)', min: 50, max: 90 },
    { id: 405, category: 'Diversos', name: 'Instalação de Quadro/Espelho', min: 50, max: 100 },
    { id: 406, category: 'Diversos', name: 'Troca de Fechadura', min: 100, max: 180 },
    { id: 407, category: 'Diversos', name: 'Regulagem de Portas de Armário', min: 80, max: 150 },
];

export const fetchReferencePrices = async () => {
    if (!supabase) return MOCK_PRICES;

    try {
        const { data, error } = await supabase
            .from('reference_prices')
            .select('*');

        if (error) throw error;
        return data && data.length > 0 ? data : MOCK_PRICES;
    } catch (error) {
        console.warn('Supabase fetch failed, using mock data:', error);
        return MOCK_PRICES;
    }
};
