import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, `${process.env.REACT_APP_ENV}.env`)
});

module.exports = {
    REACT_APP_ENV : process.env.REACT_APP_ENV,

    ETHEREUM_CHAIN_ID : Number.parseInt(process.env.ETHEREUM_CHAIN_ID),
    KLAYTN_CHAIN_ID : Number.parseInt(process.env.KLAYTN_CHAIN_ID),

    API_URL : process.env.API_URL,

    SITE_TYPE : process.env.SITE_TYPE
}
