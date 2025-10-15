import { Types } from "mongoose";
import db from "../config/db.js";
import orderModel from "../models/order.model.js";
import menuItemModel from "../models/menu.item.model.js";

const ordersData = [
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771d9a', quantity: 2 }, // Classic Margherita Pizza
            { item: '68ef239cf955c43751771da4', quantity: 1 }, // Chocolate Lava Cake
        ],
        tableNumber: 5,
        status: 'complete',
        createdBy: '68ef22fea58af19c33ce4247',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da0', quantity: 2 }, // Chicken Tikka Masala
            { item: '68ef239cf955c43751771da6', quantity: 1 }, // French Onion Soup
        ],
        tableNumber: 3,
        status: 'served',
        createdBy: '68ef22fea58af19c33ce4248',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771d9c', quantity: 1 }, // Beef Burger Deluxe
            { item: '68ef239cf955c43751771d9b', quantity: 1 }, // Grilled Chicken Caesar Salad
        ],
        tableNumber: 8,
        status: 'pending',
        createdBy: '68ef22fea58af19c33ce4247',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771d9f', quantity: 1 }, // Grilled Salmon
            { item: '68ef239cf955c43751771d9e', quantity: 1 }, // Vegetable Stir Fry
            { item: '68ef239cf955c43751771da4', quantity: 2 }, // Chocolate Lava Cake
        ],
        tableNumber: 2,
        status: 'complete',
        createdBy: '68ef22fea58af19c33ce4249',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da8', quantity: 3 }, // Pad Thai Noodles
            { item: '68ef239cf955c43751771da5', quantity: 2 }, // Thai Green Curry
        ],
        tableNumber: 10,
        status: 'served',
        createdBy: '68ef22fea58af19c33ce4248',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771d9a', quantity: 2 }, // Classic Margherita Pizza
            { item: '68ef239cf955c43751771d9d', quantity: 1 }, // Spaghetti Carbonara
        ],
        tableNumber: 7,
        status: 'pending',
        createdBy: '68ef22fea58af19c33ce4247',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da7', quantity: 2 }, // Mediterranean Lamb Kebab
            { item: '68ef239cf955c43751771da6', quantity: 2 }, // French Onion Soup
        ],
        tableNumber: 4,
        status: 'complete',
        createdBy: '68ef22fea58af19c33ce4249',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da1', quantity: 4 }, // Shrimp Tacos
            { item: '68ef239cf955c43751771d9b', quantity: 2 }, // Grilled Chicken Caesar Salad
        ],
        tableNumber: 12,
        status: 'cancel',
        createdBy: '68ef22fea58af19c33ce4249',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da2', quantity: 1 }, // Mushroom Risotto
            { item: '68ef239cf955c43751771da4', quantity: 1 }, // Chocolate Lava Cake
        ],
        tableNumber: 6,
        status: 'served',
        createdBy: '68ef22fea58af19c33ce4247',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da3', quantity: 3 }, // BBQ Pulled Pork Sandwich
            { item: '68ef239cf955c43751771d9e', quantity: 2 }, // Vegetable Stir Fry
        ],
        tableNumber: 1,
        status: 'pending',
        createdBy: '68ef22fea58af19c33ce4248',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771da0', quantity: 1 }, // Chicken Tikka Masala
            { item: '68ef239cf955c43751771da8', quantity: 1 }, // Pad Thai Noodles
            { item: '68ef239cf955c43751771da4', quantity: 1 }, // Chocolate Lava Cake
        ],
        tableNumber: 9,
        status: 'complete',
        createdBy: '68ef22fea58af19c33ce4248',
    },
    {
        _id: new Types.ObjectId(),
        items: [
            { item: '68ef239cf955c43751771d9c', quantity: 2 }, // Beef Burger Deluxe
            { item: '68ef239cf955c43751771da3', quantity: 2 }, // BBQ Pulled Pork Sandwich
        ],
        tableNumber: 11,
        status: 'pending',
        createdBy: '68ef22fea58af19c33ce4249',
    },
];

const calculateOrderTotals = async (orderData) => {
    let subTotal = 0;

    // Calculate total for each item
    for (let orderItem of orderData.items) {
        const menuItem = await menuItemModel.findById(orderItem.item);
        if (menuItem) {
            orderItem.total = menuItem.price * orderItem.quantity;
            subTotal += orderItem.total;
        }
    }

    // Calculate tax (assuming 5% GST)
    const tax = parseFloat((subTotal * 0.05).toFixed(2));
    const grandTotal = parseFloat((subTotal + tax).toFixed(2));

    return {
        ...orderData,
        subTotal,
        tax,
        grandTotal,
    };
};

; (

    async function () {

        await db();

        await orderModel.deleteMany({});
        console.log('Cleared existing orders');

        // Process and insert orders
        const processedOrders = [];

        for (let order of ordersData) {
            const orderWithTotals = await calculateOrderTotals(order);
            processedOrders.push(orderWithTotals);
        }

        await orderModel.insertMany(processedOrders);
        console.log(`Successfully seeded ${processedOrders.length} orders`);

        // Display summary
        console.log('\n--- Order Summary ---');
        processedOrders.forEach(order => {
            console.log(`Order #${order._id} - Table ${order.tableNumber} - Status: ${order.status} - Total: ₹${order.grandTotal}`);
        });

        process.exit(0);
    }
)()