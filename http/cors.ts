/*
 * Corpo do CORS
 *
 */

type CORS = {
    origin?: string;
    methods?: string | string[];
    headers?: string | string[];
    maxAge?: number;
};

/*
 * Chaves linkadas para acessar os indexes reais
 *
 */

const LINKEDKEYS = {
    origin: 'Access-Control-Allow-Origin',
    methods: 'Access-Control-Allow-Methods', 
    headers: 'Access-Control-Allow-Headers',
    maxAge: 'Access-Control-Max-Age'
};

/*
 * Implementa o corpo do CORS
 *
 */

const populateCorsBody = (options: CORS): object => {

    var cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': 86400
    }; 

    for (let index in options) {
        const getLinkedKeysValue = LINKEDKEYS[index];
        if (getLinkedKeysValue) {
            cors[getLinkedKeysValue] = options[index];            
        }
    }

    return cors;
}

export { CORS, populateCorsBody };

