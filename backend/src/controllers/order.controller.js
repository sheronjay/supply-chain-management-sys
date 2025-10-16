import * as orderService from '../../services/order.service.js';

export async function listOrders(req, res, next) {
    try {
        const orders = await orderService.listOrders();
        res.json(orders);
    } catch (err) {
        next(err);
    }
}

export async function getOrder(req, res, next) {
    try {
        const id = req.params.id;
        const order = await orderService.getOrderById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        next(err);
    }
}

export async function createOrder(req, res, next) {
    try {
        const payload = req.body;
        const created = await orderService.createOrder(payload);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
}

export async function getOrdersByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        const orders = await orderService.getOrdersByUser(userId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
}

// New controller for order statistics
export async function getOrderStats(req, res, next) {
    try {
        const stats = await orderService.getOrderStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
}

// New controller for products
export async function getProducts(req, res, next) {
    try {
        const products = await orderService.getProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
}