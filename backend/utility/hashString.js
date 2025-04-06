import bcrypt from "bcrypt"

/**
 * Hashes a given plain text using bcrypt.
 * @param {string} plainText - The plain text to hash.
 * @param {number} saltRounds - The number of salt rounds for bcrypt (default: 10).
 * @returns {Promise<string>} - A promise that resolves to the hashed text.
 */
export async function hash(plainText, saltRounds = 10) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainText, salt);

    } catch (error) {
        console.error('Error hashing text:', error);
        throw error; // Rethrow the error for the caller to handle
    }
}