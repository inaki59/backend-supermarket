// middlewares/fileSizeLimiter.ts
import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';

const MAX_SIZE_MB = 50; // Tamaño máximo en MB
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Conversión a bytes

export const fileSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    dest: 'uploads/', // Asegúrate de tener esta carpeta creada
    limits: { fileSize: MAX_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/csv') {
        return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
      }
      cb(null, true);
    },
  }).single('file'); // Nombre del campo debe ser 'file'

  upload(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: `El archivo no puede exceder los ${MAX_SIZE_MB} MB` });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Formato de archivo no permitido. Solo se permiten archivos CSV' });
      } else {
        return res.status(500).json({ message: 'Error en la carga del archivo', error: err.message });
      }
    } else if (err) {
      return res.status(500).json({ message: 'Error al procesar el archivo', error: err.message });
    }
    next();
  });
};
