"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodelist = void 0;
const generateCodelist = () => {
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const letters = Math.random().toString(36).replace(/[^a-z]/g, '').substring(0, 3).toUpperCase();
    return `${numbers}-${letters}`;
};
exports.generateCodelist = generateCodelist;
