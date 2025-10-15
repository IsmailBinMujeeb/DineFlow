import menuItemModel from "../models/menu.item.model.js";
import { Types } from "mongoose";
import db from "../config/db.js";

const menuItemsData = [
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9a'),
        itemName: "Classic Margherita Pizza",
        price: 299,
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        description: "Fresh mozzarella, tomato sauce, and basil on a crispy thin crust"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9b'),
        itemName: "Grilled Chicken Caesar Salad",
        price: 249,
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
        description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, croutons with Caesar dressing"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9c'),
        itemName: "Beef Burger Deluxe",
        price: 349,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        description: "Juicy beef patty with lettuce, tomato, onion, pickles, and special sauce on a toasted bun"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9d'),
        itemName: "Spaghetti Carbonara",
        price: 319,
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
        description: "Creamy pasta with bacon, egg yolk, parmesan cheese, and black pepper"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9e'),
        itemName: "Vegetable Stir Fry",
        price: 199,
        imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
        description: "Fresh mixed vegetables wok-tossed in savory soy sauce, served with steamed rice"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771d9f'),
        itemName: "Grilled Salmon with Lemon Butter",
        price: 599,
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
        description: "Pan-seared salmon fillet with lemon butter sauce, served with asparagus and mashed potatoes"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da0'),
        itemName: "Chicken Tikka Masala",
        price: 399,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
        description: "Tender chicken pieces in a creamy tomato-based curry sauce, served with basmati rice and naan"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da1'),
        itemName: "Shrimp Tacos (3 pieces)",
        price: 379,
        imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
        description: "Grilled shrimp with cabbage slaw, pico de gallo, and chipotle mayo in soft tortillas"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da2'),
        itemName: "Mushroom Risotto",
        price: 359,
        imageUrl: "https://images.unsplash.com/photo-1476124369491-b79a2e8f89d0?w=500",
        description: "Creamy arborio rice with wild mushrooms, parmesan cheese, and truffle oil"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da3'),
        itemName: "BBQ Pulled Pork Sandwich",
        price: 299,
        imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
        description: "Slow-cooked pulled pork with BBQ sauce, coleslaw, and pickles on a brioche bun"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da4'),
        itemName: "Chocolate Lava Cake",
        price: 179,
        imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da5'),
        itemName: "Thai Green Curry",
        price: 349,
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500",
        description: "Spicy green curry with chicken, bamboo shoots, Thai basil, and coconut milk, served with jasmine rice"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da6'),
        itemName: "French Onion Soup",
        price: 199,
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500",
        description: "Rich beef broth with caramelized onions, topped with melted gruyere cheese and croutons"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da7'),
        itemName: "Mediterranean Lamb Kebab",
        price: 499,
        imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500",
        description: "Grilled lamb skewers with tzatziki sauce, served with pita bread and Greek salad"
    },
    {
        _id: new Types.ObjectId('68ef239cf955c43751771da8'),
        itemName: "Pad Thai Noodles",
        price: 279,
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
        description: "Stir-fried rice noodles with shrimp, tofu, peanuts, bean sprouts, and tamarind sauce"
    }
];

; (

    async function () {

        await db();

        await menuItemModel.deleteMany();
        console.log('Cleared existing items');
        const items = await menuItemModel.insertMany(menuItemsData);

        console.log(items);
        process.exit(0);
    }
)()