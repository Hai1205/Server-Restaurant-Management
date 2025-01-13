const bcypt = require('bcrypt');
// import bcypt from 'bcrypt';

const saltRounds = 10

export const hashPasswordHandler = async (plainPassword: string) => {
    try {
        return await bcypt.hash(plainPassword, saltRounds)
    } catch (error) {
        console.log(error);
    }
}