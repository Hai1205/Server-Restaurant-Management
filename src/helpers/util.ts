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

export const comparePasswordHandler = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcypt.compare(plainPassword, hashPassword)
    } catch (error) {
        console.log(error);
    }
}