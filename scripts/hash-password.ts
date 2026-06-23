import { generateSalt, hashPassword } from "../lib/auth";

const passwords = ["HPN0nSt0p!14", "HPN0nSt0p!13", "HPN0nSt0p!08"];

passwords.forEach((pass) => {
    const salt = generateSalt();
    const hash = hashPassword(pass, salt);
    console.log(`Password: ${pass} -> Hash: ${salt}:${hash}`);
});
