"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSizeLimiter = void 0;
const multer_1 = __importStar(require("multer"));
const MAX_SIZE_MB = 50; // Tamaño máximo en MB
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Conversión a bytes
const fileSizeLimiter = (req, res, next) => {
    const upload = (0, multer_1.default)({
        dest: 'uploads/', // Asegúrate de tener esta carpeta creada
        limits: { fileSize: MAX_SIZE_BYTES },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'text/csv') {
                return cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
            }
            cb(null, true);
        },
    }).single('file'); // Nombre del campo debe ser 'file'
    upload(req, res, (err) => {
        if (err instanceof multer_1.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: `El archivo no puede exceder los ${MAX_SIZE_MB} MB` });
            }
            else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: 'Formato de archivo no permitido. Solo se permiten archivos CSV' });
            }
            else {
                return res.status(500).json({ message: 'Error en la carga del archivo', error: err.message });
            }
        }
        else if (err) {
            return res.status(500).json({ message: 'Error al procesar el archivo', error: err.message });
        }
        next();
    });
};
exports.fileSizeLimiter = fileSizeLimiter;
