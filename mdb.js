const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fzsjdmm68733hgu4',
    password: 'kq86u525do1qwod4',
    database: 'f3uipf8n2hwoxtt3',
    connectionLimit: 1
});

module.exports = pool;