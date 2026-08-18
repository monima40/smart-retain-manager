/* ============================================================
   DATA.JS — core data arrays, localStorage persistence, helpers
   ============================================================ */

/* =========================================================
   1. DATA
========================================================= */



let products = [
    {
        id: 1,
        name: "Rice 5kg",
        category: "Grocery",
        purchasePrice: 550,
        sellingPrice: 650,
        stock: 25,
        minimumStock: 10
    },
    {
        id: 2,
        name: "Soybean Oil 1L",
        category: "Grocery",
        purchasePrice: 160,
        sellingPrice: 190,
        stock: 8,
        minimumStock: 10
    },
    {
        id: 3,
        name: "Milk 1L",
        category: "Dairy",
        purchasePrice: 75,
        sellingPrice: 95,
        stock: 15,
        minimumStock: 5
    },
    {
        id: 4,
        name: "Biscuits",
        category: "Snacks",
        purchasePrice: 30,
        sellingPrice: 45,
        stock: 4,
        minimumStock: 10
    },
    {
        id: 5,
        name: "Shampoo",
        category: "Personal Care",
        purchasePrice: 220,
        sellingPrice: 280,
        stock: 18,
        minimumStock: 5
    }
];

let readNotifications = [];

let categories = [
    { id: 1, name: "Grocery" },
    { id: 2, name: "Dairy" },
    { id: 3, name: "Snacks" },
    { id: 4, name: "Personal Care" }
];

let suppliers = [
    {
        id: 1,
        name: "ABC Wholesale",
        phone: "01711111111",
        email: "abc@gmail.com",
        address: "Sylhet"
    },
    {
        id: 2,
        name: "Rahman Traders",
        phone: "01822222222",
        email: "rahman@gmail.com",
        address: "Sylhet"
    },
    {
        id: 3,
        name: "City Distribution",
        phone: "01933333333",
        email: "city@gmail.com",
        address: "Dhaka"
    }
];

let sales = [
    {
        id: 1,
        date: "17 Aug 2026",
        customer: "Rahim",
        phone: "",
        product: "Rice 5kg",
        quantity: 2,
        total: 1300,
        profit: 200,
        payment: "Cash"
    },
    {
        id: 2,
        date: "17 Aug 2026",
        customer: "Karim",
        phone: "",
        product: "Milk 1L",
        quantity: 3,
        total: 285,
        profit: 60,
        payment: "bKash"
    }
];

let purchases = [
    {
        id: 1,
        date: "16 Aug 2026",
        supplier: "ABC Wholesale",
        product: "Rice 5kg",
        quantity: 20,
        price: 550,
        total: 11000
    }
];


/* =========================================================
   1B. LOCAL STORAGE PERSISTENCE
   Keeps data in sync across the separate HTML pages.
   (Same idea already used for "businessInfo" below —
   just extended to every data list.)
========================================================= */

const STORAGE_KEYS = {
    products: "srm_products",
    categories: "srm_categories",
    suppliers: "srm_suppliers",
    sales: "srm_sales",
    purchases: "srm_purchases",
    readNotifications: "srm_readNotifications"
};

function loadAllData() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.products);
        const savedCategories = localStorage.getItem(STORAGE_KEYS.categories);
        const savedSuppliers = localStorage.getItem(STORAGE_KEYS.suppliers);
        const savedSales = localStorage.getItem(STORAGE_KEYS.sales);
        const savedPurchases = localStorage.getItem(STORAGE_KEYS.purchases);
        const savedReadNotifications = localStorage.getItem(STORAGE_KEYS.readNotifications);

        if (savedProducts) products = JSON.parse(savedProducts);
        if (savedCategories) categories = JSON.parse(savedCategories);
        if (savedSuppliers) suppliers = JSON.parse(savedSuppliers);
        if (savedSales) sales = JSON.parse(savedSales);
        if (savedPurchases) purchases = JSON.parse(savedPurchases);
        if (savedReadNotifications) readNotifications = JSON.parse(savedReadNotifications);
    } catch (e) {
        console.error("Could not load saved data, using defaults.", e);
    }
}

function saveAllData() {
    try {
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
        localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
        localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(suppliers));
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
        localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
        localStorage.setItem(STORAGE_KEYS.readNotifications, JSON.stringify(readNotifications));
    } catch (e) {
        console.error("Could not save data.", e);
    }
}

/* Load saved data (if any) right away, before any page renders */
loadAllData();


/* =========================================================
   2. BASIC HELPERS
========================================================= */

function money(value) {
    return "৳ " + Number(value || 0).toLocaleString();
}

function today() {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getProductById(id) {
    return products.find(p => Number(p.id) === Number(id));
}

function getSupplierById(id) {
    return suppliers.find(s => Number(s.id) === Number(id));
}

function showToast(message, type = "success") {
    document.querySelector(".toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    if (type === "error") {
        toast.style.background = "#dc2626";
    }

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}

