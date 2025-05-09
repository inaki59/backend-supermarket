"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.uploadProductsCSV = exports.createProduct = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
// Crear un producto
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = new ProductModel_1.default(req.body);
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});
exports.createProduct = createProduct;
const uploadProductsCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Si se sube un archivo CSV
        if (req.file) {
            const products = [];
            const filePath = req.file.path;
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                var _a, _b, _c, _d;
                const product = {
                    name: (_a = row.name) !== null && _a !== void 0 ? _a : '',
                    category: (_b = row.category) !== null && _b !== void 0 ? _b : '',
                    price: parseFloat(((_c = row.price) === null || _c === void 0 ? void 0 : _c.toString()) || '0'),
                    defaultQuantity: parseInt(((_d = row.defaultQuantity) === null || _d === void 0 ? void 0 : _d.toString()) || '1', 10)
                };
                products.push(product);
            })
                .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield ProductModel_1.default.insertMany(products, { ordered: false });
                    res.status(201).json({ message: 'Productos importados correctamente', productos: products.length });
                }
                catch (error) {
                    console.error('Error al guardar productos:', error);
                    res.status(500).json({ message: 'Error al guardar los productos en la base de datos' });
                }
                finally {
                    fs_1.default.unlinkSync(filePath); // Eliminar el archivo temporal
                }
            }));
        }
        else {
            // Si no se sube un archivo CSV, crear un solo producto
            const product = new ProductModel_1.default(Object.assign(Object.assign({}, req.body), { createdAt: new Date(), updatedAt: new Date() }));
            yield product.save();
            res.status(201).json(product);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});
exports.uploadProductsCSV = uploadProductsCSV;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtén los parámetros de query
        const { skip = 0, limit = 10, category, name } = req.query; // Cambiamos page por skip
        // Construye el filtro (igual que antes)
        const filter = {};
        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category };
            }
            else if (typeof category === 'string' && category.includes(',')) {
                filter.category = { $in: category.split(',') };
            }
            else {
                filter.category = category;
            }
        }
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        // Obtén los productos con filtro y paginación
        const products = yield ProductModel_1.default.find(filter)
            .skip(Number(skip))
            .limit(Number(limit));
        // Cuenta el total de productos (opcional para scroll infinito)
        const totalProducts = yield ProductModel_1.default.countDocuments(filter);
        res.status(200).json({
            total: totalProducts,
            skip: Number(skip),
            limit: Number(limit),
            products,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});
exports.getProducts = getProducts;
// Obtener un producto por su ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});
exports.getProductById = getProductById;
// Actualizar un producto por su ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});
exports.updateProduct = updateProduct;
// Eliminar un producto por su ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});
exports.deleteProduct = deleteProduct;
