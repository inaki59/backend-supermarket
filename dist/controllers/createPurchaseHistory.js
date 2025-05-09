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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchaseHistory = exports.updatePurchaseHistory = exports.getPurchaseHistoryById = exports.getAllPurchaseHistories = exports.createPurchaseHistory = void 0;
const PurcharseHostoryDocument_1 = require("../models/PurcharseHostoryDocument");
// Crear un historial de compra
const createPurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId, listName, users, products, purchasedAt } = req.body;
        const newHistory = new PurcharseHostoryDocument_1.PurchaseHistoryModel({
            listId,
            listName,
            users,
            products,
            purchasedAt,
        });
        const savedHistory = yield newHistory.save();
        res.status(201).json(savedHistory);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creando el historial de compra' });
    }
});
exports.createPurchaseHistory = createPurchaseHistory;
// Obtener todos los historiales
const getAllPurchaseHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const histories = yield PurcharseHostoryDocument_1.PurchaseHistoryModel.find();
        res.status(200).json(histories);
    }
    catch (error) {
        res.status(500).json({ error: 'Error obteniendo los historiales de compra' });
    }
});
exports.getAllPurchaseHistories = getAllPurchaseHistories;
// Obtener un historial por ID
const getPurchaseHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const history = yield PurcharseHostoryDocument_1.PurchaseHistoryModel.findById(id);
        if (!history) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }
        res.status(200).json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Error obteniendo el historial de compra' });
    }
});
exports.getPurchaseHistoryById = getPurchaseHistoryById;
// Actualizar un historial
const updatePurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedHistory = yield PurcharseHostoryDocument_1.PurchaseHistoryModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedHistory) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }
        res.status(200).json(updatedHistory);
    }
    catch (error) {
        res.status(500).json({ error: 'Error actualizando el historial de compra' });
    }
});
exports.updatePurchaseHistory = updatePurchaseHistory;
// Eliminar un historial
const deletePurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedHistory = yield PurcharseHostoryDocument_1.PurchaseHistoryModel.findByIdAndDelete(id);
        if (!deletedHistory) {
            return res.status(404).json({ error: 'Historial no encontrado' });
        }
        res.status(200).json({ message: 'Historial eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error eliminando el historial de compra' });
    }
});
exports.deletePurchaseHistory = deletePurchaseHistory;
