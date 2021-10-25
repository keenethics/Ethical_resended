const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.DB_USER}:` + 
                         `${process.env.DB_PASSWORD}@${process.env.DB_HOST}:` +
                         `${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
console.log(`Connecting as production: ${isProduction}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

const pool = new Pool({
    connectionString:isProduction ? process.env.DATABASE_URL : connectionString,
    // ssl: { rejectUnauthorized: false }
});

pool.query(`
CREATE TABLE IF NOT EXISTS credentials(
    id serial PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE,
    team_id VARCHAR(20),
    user_access_token VARCHAR(200),
    bot_access_token VARCHAR(200),
    bot_user_id VARCHAR(20),
    team_name VARCHAR(100),
    bot_scopes VARCHAR(200),
    user_scopes VARCHAR(200)
)`, [], (err) => {if(err) console.log(err)});

module.exports.get = async (team_id, user_id=null) => {
    let queryString = (user_id) ? 'team_id=$1 AND user_id=$2' : 'team_id=$1'
    let parameters = user_id ? [team_id, user_id] : [team_id]

    let { rows } = await pool.query(
        'SELECT * FROM credentials WHERE ' + queryString,
        parameters
        )
    if(rows.length) {
        return rows[0];
    } else {
        return null;
    }
}

module.exports.set = async (newRow) => {
    const cols = ['user_id', 'team_id', 'user_access_token', 'bot_user_id',
                 'bot_access_token', 'team_name', 'bot_scopes', 'user_scopes'];
    let columns = [cols.join(', ')];
    let values = [];
    cols.forEach((col) => {
        if(newRow.hasOwnProperty(col)) {
            values.push(newRow[col]);
        } else {
            console.log(`Could not find field ${col} on db.set!`);
            return;
        }
    });

    return pool.query(
        `INSERT INTO credentials(${columns}) VALUES` +
        '($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *', values, 
        (err) => {
            if(err && err.constraint) {
                return pool.query(
                    'UPDATE credentials SET team_id=$2, user_access_token=$3' +
                    ', bot_user_id=$4, team_name=$5, bot_scopes=$6' + 
                    ', bot_access_token=$7, user_scopes=$8' +
                    ' WHERE user_id=$1 RETURNING *', 
                    values, (err) => console.log(err)
                    )
            }
        });
}

module.exports.delete = async (user_id, team_id) => {
    return pool.query(
        'DELETE FROM credentials WHERE user_id=$1 AND team_id=$2 RETURNING *', 
        [user_id, team_id], 
        (err) => {if(err) console.log(err)});
}