/* ============================================================
   DATA.JS
   Smart Retail Business Manager
   MySQL + PHP API Connection
============================================================ */


/* =========================================================
   1. API CONFIGURATION
========================================================= */

const API_BASE = "./backend/api";


/* =========================================================
   2. MAIN DATA ARRAYS
========================================================= */

let products = [];
let categories = [];
let suppliers = [];
let sales = [];
let purchases = [];
let customers = [];
let readNotifications = [];


/* =========================================================
   3. STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

    readNotifications:
        "srm_readNotifications",

    businessInfo:
        "businessInfo"

};


/* =========================================================
   4. API GET HELPER
========================================================= */

async function apiGet(file) {

    try {

        const response =
            await fetch(
                `${API_BASE}/${file}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "API request failed"
            );

        }


        console.log(
            `${file} API response:`,
            result.data
        );


        return result.data || [];

    }
    catch (error) {

        console.error(
            `API Error: ${file}`,
            error
        );


        return [];

    }

}


/* =========================================================
   5. LOAD PRODUCTS
========================================================= */

async function loadProductsFromDatabase() {

    const data =
        await apiGet(
            "products.php"
        );


    products =
        data.map(product => ({

            id:
                Number(
                    product.product_id
                ),

            name:
                product.product_name ||
                "",

            category:
                product.category_name ||
                "",

            purchasePrice:
                Number(
                    product.purchase_price ||
                    0
                ),

            sellingPrice:
                Number(
                    product.selling_price ||
                    0
                ),

            stock:
                Number(
                    product.stock_quantity ||
                    0
                ),

            minimumStock:
                Number(
                    product.low_stock_limit ||
                    0
                )

        }));


    console.log(
        "PRODUCTS FROM MYSQL:",
        products
    );

}


/* =========================================================
   6. LOAD CATEGORIES
========================================================= */

async function loadCategoriesFromDatabase() {

    const data =
        await apiGet(
            "categories.php"
        );


    categories =
        data.map(category => ({

            id:
                Number(
                    category.category_id
                ),

            name:
                category.category_name ||
                ""

        }));


    console.log(
        "CATEGORIES FROM MYSQL:",
        categories
    );

}


/* =========================================================
   7. LOAD SUPPLIERS
========================================================= */

async function loadSuppliersFromDatabase() {

    const data =
        await apiGet(
            "suppliers.php"
        );


    suppliers =
        data.map(supplier => ({

            id:
                Number(
                    supplier.supplier_id
                ),

            name:
                supplier.supplier_name ||
                "",

            phone:
                supplier.phone ||
                "",

            email:
                supplier.email ||
                "",

            address:
                supplier.address ||
                ""

        }));


    console.log(
        "SUPPLIERS FROM MYSQL:",
        suppliers
    );

}


/* =========================================================
   8. LOAD CUSTOMERS
========================================================= */

async function loadCustomersFromDatabase() {

    const data =
        await apiGet(
            "customer.php"
        );


    customers =
        data.map(customer => ({

            id:
                Number(
                    customer.customer_id
                ),

            name:
                customer.customer_name ||
                "",

            phone:
                customer.phone ||
                ""

        }));


    console.log(
        "CUSTOMERS FROM MYSQL:",
        customers
    );

}


/* =========================================================
   9. LOAD PURCHASES
========================================================= */

async function loadPurchasesFromDatabase() {

    const data =
        await apiGet(
            "purchases.php"
        );


    purchases =
        data.map(purchase => ({

            id:
                Number(
                    purchase.purchase_id
                ),

            date:
                purchase.purchase_date ||
                "",

            supplier:
                purchase.supplier_name ||
                "",

            total:
                Number(
                    purchase.total_amount ||
                    0
                )

        }));


    console.log(
        "PURCHASES FROM MYSQL:",
        purchases
    );

}


/* =========================================================
   10. LOAD SALES
========================================================= */

async function loadSalesFromDatabase() {

    const data =
        await apiGet(
            "sales.php"
        );


    sales =
        data.map(sale => ({

            id:
                Number(
                    sale.sale_id
                ),

            date:
                sale.sale_date ||
                "",

            customer:
                sale.customer_name ||
                "",

            phone:
                sale.phone ||
                "",

            product:
                sale.product_name ||
                "",

            quantity:
                Number(
                    sale.quantity ||
                    0
                ),

            subtotal:
                Number(
                    sale.subtotal ||
                    0
                ),

            discount:
                Number(
                    sale.discount ||
                    0
                ),

            total:
                Number(
                    sale.total_amount ||
                    0
                ),

            profit:
                Number(
                    sale.profit ||
                    0
                ),

            payment:
                sale.payment_method ||
                "Cash"

        }));


    console.log(
        "SALES FROM MYSQL:",
        sales
    );

}


/* =========================================================
   11. NOTIFICATIONS
========================================================= */

function loadReadNotifications() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.readNotifications
            );


        if (saved) {

            readNotifications =
                JSON.parse(
                    saved
                );

        }

    }
    catch (error) {

        console.error(
            "Could not load notification data.",
            error
        );


        readNotifications = [];

    }

}


/* =========================================================
   12. SAVE NOTIFICATIONS
========================================================= */

function saveReadNotifications() {

    try {

        localStorage.setItem(

            STORAGE_KEYS.readNotifications,

            JSON.stringify(
                readNotifications
            )

        );

    }
    catch (error) {

        console.error(
            "Could not save notification data.",
            error
        );

    }

}


/* =========================================================
   13. LOAD ALL DATABASE DATA
========================================================= */

async function loadAllDataFromDatabase() {

    console.log(
        "===================================="
    );


    console.log(
        "Connecting Smart Retail to MySQL..."
    );


    console.log(
        "===================================="
    );


    await Promise.all([

        loadProductsFromDatabase(),

        loadCategoriesFromDatabase(),

        loadSuppliersFromDatabase(),

        loadCustomersFromDatabase(),

        loadPurchasesFromDatabase(),

        loadSalesFromDatabase()

    ]);


    loadReadNotifications();


    console.log(
        "===================================="
    );


    console.log(
        "DATABASE LOAD COMPLETE"
    );


    console.log(
        "Products:",
        products.length
    );


    console.log(
        "Categories:",
        categories.length
    );


    console.log(
        "Suppliers:",
        suppliers.length
    );


    console.log(
        "Customers:",
        customers.length
    );


    console.log(
        "Purchases:",
        purchases.length
    );


    console.log(
        "Sales:",
        sales.length
    );


    console.log(
        "===================================="
    );

}


/* =========================================================
   14. MONEY HELPER
========================================================= */

function money(value) {

    return (
        "৳ " +
        Number(
            value || 0
        ).toLocaleString()
    );

}


/* =========================================================
   15. TODAY
========================================================= */

function today() {

    return new Date().toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   16. GET PRODUCT
========================================================= */

function getProductById(id) {

    return products.find(
        product =>
            Number(product.id) ===
            Number(id)
    );

}


/* =========================================================
   17. GET SUPPLIER
========================================================= */

function getSupplierById(id) {

    return suppliers.find(
        supplier =>
            Number(supplier.id) ===
            Number(id)
    );

}


/* =========================================================
   18. GET CUSTOMER
========================================================= */

function getCustomerById(id) {

    return customers.find(
        customer =>
            Number(customer.id) ===
            Number(id)
    );

}


/* =========================================================
   19. TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    document
        .querySelector(".toast")
        ?.remove();


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    if (type === "error") {

        toast.style.background =
            "#dc2626";

    }


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => toast.remove(),
        2500
    );

}


/* =========================================================
   20. BUSINESS INFORMATION
========================================================= */

function loadBusinessInfo() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.businessInfo
            );


        if (!saved) {
            return;
        }


        const info =
            JSON.parse(saved);


        const adminName =
            document.getElementById(
                "adminName"
            );


        const phone =
            document.getElementById(
                "businessPhone"
            );


        const email =
            document.getElementById(
                "businessEmail"
            );


        const address =
            document.getElementById(
                "businessAddress"
            );


        if (adminName) {

            adminName.value =
                info.adminName ||
                "";

        }


        if (phone) {

            phone.value =
                info.phone ||
                "";

        }


        if (email) {

            email.value =
                info.email ||
                "";

        }


        if (address) {

            address.value =
                info.address ||
                "";

        }

    }
    catch (error) {

        console.error(
            "Could not load business information.",
            error
        );

    }

}


/* =========================================================
   21. SAVE BUSINESS INFORMATION
========================================================= */

function saveBusinessInfoData(
    adminName,
    phone,
    email,
    address
) {

    localStorage.setItem(

        STORAGE_KEYS.businessInfo,

        JSON.stringify({

            adminName:
                adminName || "",

            phone:
                phone || "",

            email:
                email || "",

            address:
                address || ""

        })

    );

}


/* =========================================================
   22. START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Smart Retail frontend started."
        );


        loadBusinessInfo();


        await loadAllDataFromDatabase();


        if (
            typeof updateAll ===
            "function"
        ) {

            updateAll();

        }


        if (
            typeof calculatePurchase ===
            "function"
        ) {

            calculatePurchase();

        }


        if (
            typeof updateSaleCalculation ===
            "function"
        ) {

            updateSaleCalculation();

        }


        console.log(
            "Smart Retail connected to MySQL successfully."
        );

    }
);