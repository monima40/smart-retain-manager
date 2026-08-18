/* =========================================================
   SMART RETAIL BUSINESS MANAGER
   MODIFIED SCRIPT.JS
   Matches the uploaded index.html
========================================================= */

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

/* =========================================================
   3. PAGE NAVIGATION
========================================================= */

const navLinks = document.querySelectorAll(".nav-link");

const pageTitles = {
    dashboard: [
        "Dashboard",
        "Here's what's happening with your business today."
    ],
    products: [
        "Products",
        "Manage your products and stock."
    ],
    categories: [
        "Categories",
        "Organize your products by category."
    ],
    suppliers: [
        "Suppliers",
        "Manage your product suppliers."
    ],
    purchase: [
        "Purchase",
        "Record products purchased from suppliers."
    ],
    sales: [
        "Sells",
        "Record customer sales and track profit."
    ],
    reports: [
        "Reports",
        "Understand your business performance."
    ],
    settings: [
        "Settings",
        "Manage your business settings."
    ]
};

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName + "-page");

    if (!selectedPage) return;

    selectedPage.classList.add("active-page");

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("data-page") === pageName
        );
    });

    const title = pageTitles[pageName];

    if (title) {
        document.getElementById("page-title").textContent = title[0];
        document.getElementById("page-subtitle").textContent = title[1];
    }

    document.querySelector(".sidebar")?.classList.remove("mobile-open");

    updateAll();
}

navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        showPage(this.getAttribute("data-page"));
    });
});

/* =========================================================
   4. MODALS
========================================================= */

function openModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("show");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("show");
    }
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function (e) {
        if (e.target === this) {
            this.classList.remove("show");
        }
    });
});

/* =========================================================
   5. PRODUCTS
========================================================= */

function renderProducts() {
    const table = document.getElementById("productsTable");

    if (!table) return;

    const search =
        document.getElementById("productSearch")?.value
            .toLowerCase()
            .trim() || "";

    table.innerHTML = "";

    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );
    });

    if (filteredProducts.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;padding:25px;color:#6b7280;">
                    No products found.
                </td>
            </tr>
        `;
    }

    filteredProducts.forEach(product => {

        const lowStock =
            Number(product.stock) <=
            Number(product.minimumStock);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${product.name}</strong>
            </td>

            <td>${product.category}</td>

            <td>${money(product.purchasePrice)}</td>

            <td>${money(product.sellingPrice)}</td>

            <td>${product.stock}</td>

            <td>
                <span class="status ${lowStock ? "low" : "good"}">
                    ${lowStock ? "Low Stock" : "In Stock"}
                </span>
            </td>

            <td>
                <button
                    class="action-btn"
                    onclick="deleteProduct(${product.id})"
                    title="Delete Product"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    const productCount =
        document.getElementById("productCount");

    const totalStock =
        document.getElementById("totalStock");

    const productLowStock =
        document.getElementById("productLowStock");

    if (productCount) {
        productCount.textContent = products.length;
    }

    if (totalStock) {
        totalStock.textContent =
            products.reduce(
                (sum, p) => sum + Number(p.stock),
                0
            );
    }

    if (productLowStock) {
        productLowStock.textContent =
            products.filter(
                p =>
                    Number(p.stock) <=
                    Number(p.minimumStock)
            ).length;
    }
}

function deleteProduct(id) {

    const product = getProductById(id);

    if (!product) return;

    if (!confirm(`Delete ${product.name}?`)) {
        return;
    }

    products = products.filter(
        p => p.id !== Number(id)
    );

    updateAll();

    showToast("Product deleted successfully.");
}

document
    .getElementById("productSearch")
    ?.addEventListener(
        "input",
        renderProducts
    );


    /* =========================================================
   6. CATEGORIES
========================================================= */

function renderCategories() {
    const container = document.getElementById("categoryList");

    if (!container) return;

    container.innerHTML = "";

    if (categories.length === 0) {
        container.innerHTML = `
            <div style="
                padding:25px;
                color:#6b7280;
                text-align:center;
            ">
                No categories added yet.
            </div>
        `;

        return;
    }

    categories.forEach(category => {

        const count = products.filter(
            product =>
                product.category === category.name
        ).length;

        const card = document.createElement("div");

        card.className = "category-card";

        card.innerHTML = `
            <div class="category-icon">
                <i class="fa-solid fa-layer-group"></i>
            </div>

            <h3>${category.name}</h3>

            <p>
                ${count} product${count !== 1 ? "s" : ""}
            </p>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   7. SUPPLIERS
========================================================= */

function renderSuppliers() {

    const container =
        document.getElementById("supplierList");

    if (!container) return;

    container.innerHTML = "";

    if (suppliers.length === 0) {

        container.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                color:#6b7280;
            ">
                No suppliers added yet.
            </div>
        `;

        return;
    }

    suppliers.forEach(supplier => {

        const card =
            document.createElement("div");

        card.className = "supplier-card";

        card.innerHTML = `
            <div class="supplier-top">

                <div class="supplier-avatar">
                    ${supplier.name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <h3>${supplier.name}</h3>

                    <span>Supplier</span>
                </div>

            </div>

            <div class="supplier-info">

                <p>
                    <i class="fa-solid fa-phone"></i>
                    ${supplier.phone}
                </p>

                <p>
                    <i class="fa-solid fa-envelope"></i>
                    ${supplier.email || "No email"}
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${supplier.address || "No address"}
                </p>

            </div>
        `;

        container.appendChild(card);
    });

    populateSupplierSelect();
}


/* =========================================================
   8. DROPDOWN DATA
========================================================= */

function populateProductSelects() {

    const purchaseSelect =
        document.getElementById("purchaseProduct");

    const salesSelect =
        document.getElementById("salesProduct");

    const categorySelect =
        document.getElementById("productCategory");


    /* -----------------------------
       PURCHASE PRODUCT
    ----------------------------- */

    if (purchaseSelect) {

        const current =
            purchaseSelect.value;

        purchaseSelect.innerHTML = `
            <option value="">
                Select Product
            </option>
        `;

        products.forEach(product => {

            const option =
                document.createElement("option");

            option.value = product.id;

            option.textContent =
                `${product.name} (${product.stock} in stock)`;

            purchaseSelect.appendChild(option);
        });

        purchaseSelect.value = current;
    }


    /* -----------------------------
       SALES PRODUCT
    ----------------------------- */

    if (salesSelect) {

        const current =
            salesSelect.value;

        salesSelect.innerHTML = `
            <option value="">
                Select Product
            </option>
        `;

        products.forEach(product => {

            const option =
                document.createElement("option");

            option.value = product.id;

            option.textContent =
                `${product.name} (${product.stock} available)`;

            salesSelect.appendChild(option);
        });

        salesSelect.value = current;
    }


    /* -----------------------------
       PRODUCT CATEGORY
    ----------------------------- */

    if (categorySelect) {

        const current =
            categorySelect.value;

        categorySelect.innerHTML = `
            <option value="">
                Select Category
            </option>
        `;

        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.name;

            option.textContent = category.name;

            categorySelect.appendChild(option);
        });

        categorySelect.value = current;
    }
}


/* =========================================================
   9. SUPPLIER DROPDOWN
========================================================= */

function populateSupplierSelect() {

    const select =
        document.getElementById("purchaseSupplier");

    if (!select) return;

    const current =
        select.value;

    select.innerHTML = `
        <option value="">
            Select Supplier
        </option>
    `;

    suppliers.forEach(supplier => {

        const option =
            document.createElement("option");

        option.value = supplier.id;

        option.textContent =
            supplier.name;

        select.appendChild(option);
    });

    select.value = current;
}


/* =========================================================
   10. PURCHASE CALCULATION
========================================================= */

function calculatePurchase() {

    const quantity =
        Number(
            document.getElementById(
                "purchaseQuantity"
            )?.value
        ) || 0;

    const price =
        Number(
            document.getElementById(
                "purchasePrice"
            )?.value
        ) || 0;

    const total =
        quantity * price;

    const output =
        document.getElementById(
            "purchaseTotal"
        );

    if (output) {
        output.textContent =
            money(total);
    }
}


/* =========================================================
   PURCHASE INPUT EVENTS
========================================================= */

document
    .getElementById("purchaseQuantity")
    ?.addEventListener(
        "input",
        calculatePurchase
    );

document
    .getElementById("purchasePrice")
    ?.addEventListener(
        "input",
        calculatePurchase
    );


/* =========================================================
   11. PURCHASE FORM
========================================================= */

document
    .getElementById("purchaseForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const supplierId =
                Number(
                    document.getElementById(
                        "purchaseSupplier"
                    ).value
                );


            const productId =
                Number(
                    document.getElementById(
                        "purchaseProduct"
                    ).value
                );


            const quantity =
                Number(
                    document.getElementById(
                        "purchaseQuantity"
                    ).value
                );


            const price =
                Number(
                    document.getElementById(
                        "purchasePrice"
                    ).value
                );


            const supplier =
                getSupplierById(
                    supplierId
                );


            const product =
                getProductById(
                    productId
                );


            /* -----------------------------
               VALIDATION
            ----------------------------- */

            if (!supplier || !product) {

                showToast(
                    "Please select supplier and product.",
                    "error"
                );

                return;
            }


            if (
                quantity <= 0 ||
                price < 0
            ) {

                showToast(
                    "Please enter valid quantity and price.",
                    "error"
                );

                return;
            }


            /* -----------------------------
               UPDATE STOCK
            ----------------------------- */

            product.stock += quantity;


            /* -----------------------------
               SAVE PURCHASE
            ----------------------------- */

            purchases.unshift({

                id: Date.now(),

                date: today(),

                supplier:
                    supplier.name,

                product:
                    product.name,

                quantity:
                    quantity,

                price:
                    price,

                total:
                    quantity * price
            });


            /* -----------------------------
               RESET FORM
            ----------------------------- */

            this.reset();


            const purchaseTotal =
                document.getElementById(
                    "purchaseTotal"
                );

            if (purchaseTotal) {
                purchaseTotal.textContent =
                    money(0);
            }


            /* -----------------------------
               UPDATE EVERYTHING
            ----------------------------- */

            updateAll();


            showToast(
                "Purchase completed successfully."
            );
        }
    );


/* =========================================================
   12. PURCHASE TABLE
========================================================= */

function renderPurchases() {

    const table =
        document.getElementById(
            "purchaseTable"
        );

    if (!table) return;

    table.innerHTML = "";


    if (purchases.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    ">
                    No purchases recorded yet.
                </td>
            </tr>
        `;

        return;
    }


    purchases.forEach(purchase => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${purchase.date}
            </td>

            <td>
                ${purchase.supplier}
            </td>

            <td>
                ${purchase.product}
            </td>

            <td>
                ${purchase.quantity}
            </td>

            <td>
                ${money(purchase.price)}
            </td>

            <td>
                <strong>
                    ${money(purchase.total)}
                </strong>
            </td>

        `;


        table.appendChild(row);
    });
}

/* =========================================================
   13. SALES CALCULATION
========================================================= */

function updateSaleCalculation() {

    const productId =
        Number(
            document.getElementById(
                "salesProduct"
            )?.value
        );

    const quantity =
        Number(
            document.getElementById(
                "salesQuantity"
            )?.value
        ) || 0;

    const discount =
        Number(
            document.getElementById(
                "salesDiscount"
            )?.value
        ) || 0;

    const product =
        getProductById(productId);


    const unitPrice =
        document.getElementById(
            "saleUnitPrice"
        );

    const subtotalEl =
        document.getElementById(
            "saleSubtotal"
        );

    const discountEl =
        document.getElementById(
            "saleDiscount"
        );

    const totalEl =
        document.getElementById(
            "saleTotal"
        );

    const profitEl =
        document.getElementById(
            "estimatedProfit"
        );


    /* -----------------------------
       NO PRODUCT SELECTED
    ----------------------------- */

    if (!product) {

        if (unitPrice) {
            unitPrice.textContent =
                money(0);
        }

        if (subtotalEl) {
            subtotalEl.textContent =
                money(0);
        }

        if (discountEl) {
            discountEl.textContent =
                money(discount);
        }

        if (totalEl) {
            totalEl.textContent =
                money(0);
        }

        if (profitEl) {
            profitEl.textContent =
                money(0);
        }

        return;
    }


    /* -----------------------------
       CALCULATIONS
    ----------------------------- */

    const subtotal =
        product.sellingPrice *
        quantity;


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    /*
       Profit =
       Selling price - Purchase price
       - Discount
    */

    const profit =
        Math.max(
            0,
            (
                product.sellingPrice -
                product.purchasePrice
            ) * quantity -
            discount
        );


    /* -----------------------------
       DISPLAY RESULTS
    ----------------------------- */

    if (unitPrice) {

        unitPrice.textContent =
            money(
                product.sellingPrice
            );
    }


    if (subtotalEl) {

        subtotalEl.textContent =
            money(subtotal);
    }


    if (discountEl) {

        discountEl.textContent =
            money(discount);
    }


    if (totalEl) {

        totalEl.textContent =
            money(total);
    }


    if (profitEl) {

        profitEl.textContent =
            money(profit);
    }
}


/* =========================================================
   SALES INPUT EVENTS
========================================================= */

document
    .getElementById("salesProduct")
    ?.addEventListener(
        "change",
        updateSaleCalculation
    );


document
    .getElementById("salesQuantity")
    ?.addEventListener(
        "input",
        updateSaleCalculation
    );


document
    .getElementById("salesDiscount")
    ?.addEventListener(
        "input",
        updateSaleCalculation
    );


/* =========================================================
   14. SALES FORM
========================================================= */

document
    .getElementById("salesForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            /* -----------------------------
               GET FORM DATA
            ----------------------------- */

            const customer =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const productId =
                Number(
                    document.getElementById(
                        "salesProduct"
                    ).value
                );


            const quantity =
                Number(
                    document.getElementById(
                        "salesQuantity"
                    ).value
                );


            const discount =
                Number(
                    document.getElementById(
                        "salesDiscount"
                    ).value
                ) || 0;


            const payment =
                document.getElementById(
                    "paymentMethod"
                ).value;


            const product =
                getProductById(
                    productId
                );


            /* -----------------------------
               VALIDATION
            ----------------------------- */

            if (!customer) {

                showToast(
                    "Please enter customer name.",
                    "error"
                );

                return;
            }


            if (!product) {

                showToast(
                    "Please select a product.",
                    "error"
                );

                return;
            }


            if (quantity <= 0) {

                showToast(
                    "Please enter a valid quantity.",
                    "error"
                );

                return;
            }


            if (quantity > product.stock) {

                showToast(
                    `Only ${product.stock} units available.`,
                    "error"
                );

                return;
            }


            if (discount < 0) {

                showToast(
                    "Discount cannot be negative.",
                    "error"
                );

                return;
            }


            const subtotal =
                product.sellingPrice *
                quantity;


            if (discount > subtotal) {

                showToast(
                    "Discount cannot be greater than the subtotal.",
                    "error"
                );

                return;
            }


            /* -----------------------------
               TOTAL
            ----------------------------- */

            const total =
                subtotal - discount;


            /* -----------------------------
               PROFIT
            ----------------------------- */

            const profit =
                (
                    product.sellingPrice -
                    product.purchasePrice
                ) * quantity -
                discount;


            /* -----------------------------
               REDUCE STOCK
            ----------------------------- */

            product.stock -= quantity;


            /* -----------------------------
               SAVE SALE
            ----------------------------- */

            sales.unshift({

                id: Date.now(),

                date: today(),

                customer:
                    customer,

                phone:
                    phone,

                product:
                    product.name,

                quantity:
                    quantity,

                total:
                    total,

                profit:
                    profit,

                payment:
                    payment
            });


            /* -----------------------------
               RESET FORM
            ----------------------------- */

            this.reset();


            const quantityInput =
                document.getElementById(
                    "salesQuantity"
                );

            if (quantityInput) {
                quantityInput.value = 1;
            }


            const discountInput =
                document.getElementById(
                    "salesDiscount"
                );

            if (discountInput) {
                discountInput.value = 0;
            }


            updateSaleCalculation();


            /* -----------------------------
               UPDATE SYSTEM
            ----------------------------- */

            updateAll();


            showToast(
                "Sale completed successfully!"
            );
        }
    );


/* =========================================================
   15. SALES TABLE
========================================================= */

function renderSales() {

    const table =
        document.getElementById(
            "salesTable"
        );

    if (!table) return;


    table.innerHTML = "";


    if (sales.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    ">
                    No sales recorded yet.
                </td>
            </tr>
        `;

        return;
    }


    sales.forEach(sale => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${sale.date}
            </td>


            <td>

                <strong>
                    ${sale.customer}
                </strong>

                ${
                    sale.phone
                        ? `
                            <br>
                            <small>
                                ${sale.phone}
                            </small>
                          `
                        : ""
                }

            </td>


            <td>
                ${sale.product}
            </td>


            <td>
                ${sale.quantity}
            </td>


            <td>

                <strong>
                    ${money(sale.total)}
                </strong>

            </td>


            <td>

                <span class="positive">
                    ${money(sale.profit)}
                </span>

            </td>


            <td>

                <span class="status good">
                    ${sale.payment}
                </span>

            </td>

        `;


        table.appendChild(row);
    });
}


/* =========================================================
   CLEAR SALES
========================================================= */

function clearSales() {

    if (
        !confirm(
            "Are you sure you want to clear sales history?"
        )
    ) {
        return;
    }


    sales = [];


    updateAll();


    showToast(
        "Sales history cleared."
    );
}


/* =========================================================
   16. BUSINESS DATA
========================================================= */

function calculateBusinessData() {

    const revenue =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const profit =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.profit || 0
                ),
            0
        );


    const margin =
        revenue > 0
            ? (profit / revenue) * 100
            : 0;


    const lowStock =
        products.filter(
            product =>
                Number(product.stock) <=
                Number(product.minimumStock)
        );


    return {
        revenue,
        profit,
        margin,
        lowStock
    };
}


/* =========================================================
   17. DASHBOARD
========================================================= */

function updateDashboard() {

    const data =
        calculateBusinessData();


    const dashboardSales =
        document.getElementById(
            "dashboardSales"
        );


    const dashboardProfit =
        document.getElementById(
            "dashboardProfit"
        );


    const dashboardProducts =
        document.getElementById(
            "dashboardProducts"
        );


    const dashboardLowStock =
        document.getElementById(
            "dashboardLowStock"
        );


    if (dashboardSales) {

        dashboardSales.textContent =
            money(data.revenue);
    }


    if (dashboardProfit) {

        dashboardProfit.textContent =
            money(data.profit);
    }


    if (dashboardProducts) {

        dashboardProducts.textContent =
            products.length;
    }


    if (dashboardLowStock) {

        dashboardLowStock.textContent =
            data.lowStock.length;
    }


    /* -----------------------------
       PROFIT MARGIN
    ----------------------------- */

    const margin =
        document.getElementById(
            "profitMargin"
        );


    const marginRevenue =
        document.getElementById(
            "marginRevenue"
        );


    const marginProfit =
        document.getElementById(
            "marginProfit"
        );


    if (margin) {

        margin.textContent =
            data.margin.toFixed(1) + "%";
    }


    if (marginRevenue) {

        marginRevenue.textContent =
            money(data.revenue);
    }


    if (marginProfit) {

        marginProfit.textContent =
            money(data.profit);
    }


    /* -----------------------------
       PROFIT CIRCLE
    ----------------------------- */

    const circle =
        document.querySelector(
            ".profit-circle"
        );


    if (circle) {

        const degree =
            Math.min(
                360,
                Math.max(
                    0,
                    data.margin * 3.6
                )
            );


        circle.style.background = `
            conic-gradient(
                var(--primary)
                ${degree}deg,
                #ede9fe
                ${degree}deg
            )
        `;
    }


    renderLowStock();


    calculateBreakEven();
}


/* =========================================================
   18. LOW STOCK ALERT
========================================================= */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );


    if (!container) return;


    const lowProducts =
        products.filter(
            product =>
                Number(product.stock) <=
                Number(product.minimumStock)
        );


    container.innerHTML = "";


    if (lowProducts.length === 0) {

        container.innerHTML = `

            <div style="
                padding:20px;
                text-align:center;
                color:#16a34a;
                font-size:12px;
            ">

                <i class="fa-solid fa-circle-check"></i>

                All products have sufficient stock.

            </div>

        `;

        return;
    }


    lowProducts.forEach(product => {

        const item =
            document.createElement("div");


        item.className =
            "stock-item";


        item.innerHTML = `

            <div class="stock-product">

                <div class="product-mini-icon">

                    <i class="fa-solid fa-box"></i>

                </div>


                <div>

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.category}
                    </span>

                </div>

            </div>


            <div class="stock-number">

                ${product.stock} left

            </div>

        `;


        container.appendChild(item);
    });
}


/* =========================================================
   19. BREAK-EVEN CALCULATION
========================================================= */

function calculateBreakEven() {

    const fixedCost =
        Number(
            document.getElementById(
                "fixedCost"
            )?.value
        ) || 0;


    const sellingPrice =
        Number(
            document.getElementById(
                "breakSellingPrice"
            )?.value
        ) || 0;


    const variableCost =
        Number(
            document.getElementById(
                "variableCost"
            )?.value
        ) || 0;


    /*

       Contribution per unit =
       Selling Price - Variable Cost

       Break-even quantity =
       Fixed Cost / Contribution per unit

    */

    const contribution =
        sellingPrice -
        variableCost;


    let quantity = 0;


    if (
        contribution > 0 &&
        fixedCost > 0
    ) {

        quantity =
            Math.ceil(
                fixedCost /
                contribution
            );
    }


    /* -----------------------------
       BREAK-EVEN RESULT
    ----------------------------- */

    const result =
        document.getElementById(
            "breakResult"
        );


    const dashboardResult =
        document.getElementById(
            "breakEvenQuantity"
        );


    if (result) {

        result.textContent =
            quantity > 0
                ? `${quantity} units`
                : "Not possible";
    }


    if (dashboardResult) {

        dashboardResult.textContent =
            quantity > 0
                ? `${quantity} units`
                : "Not possible";
    }


    /* -----------------------------
       SOLD UNITS
    ----------------------------- */

    const soldUnits =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.quantity || 0
                ),
            0
        );


    /* -----------------------------
       PROGRESS
    ----------------------------- */

    const progress =
        quantity > 0
            ? Math.min(
                100,
                (soldUnits / quantity) *
                100
            )
            : 0;


    const progressBar =
        document.getElementById(
            "breakEvenProgress"
        );


    if (progressBar) {

        progressBar.style.width =
            progress + "%";
    }


    /* -----------------------------
       BREAK-EVEN MESSAGE
    ----------------------------- */

    const breakText =
        document.getElementById(
            "breakEvenText"
        );


    if (breakText) {

        if (quantity === 0) {

            breakText.textContent =
                "Selling price must be greater than variable cost.";

        } else if (
            soldUnits >= quantity
        ) {

            breakText.textContent =
                "Congratulations! Your current sales have reached the break-even target.";

        } else {

            breakText.textContent =
                `You are ${progress.toFixed(
                    0
                )}% toward your break-even target.`;
        }
    }
}


/* =========================================================
   20. REPORTS
========================================================= */

function updateReports() {

    const data =
        calculateBusinessData();


    const reportRevenue =
        document.getElementById(
            "reportRevenue"
        );


    const reportProfit =
        document.getElementById(
            "reportProfit"
        );


    const reportMargin =
        document.getElementById(
            "reportMargin"
        );


    const reportTransactions =
        document.getElementById(
            "reportTransactions"
        );


    if (reportRevenue) {

        reportRevenue.textContent =
            money(data.revenue);
    }


    if (reportProfit) {

        reportProfit.textContent =
            money(data.profit);
    }


    if (reportMargin) {

        reportMargin.textContent =
            data.margin.toFixed(1) + "%";
    }


    if (reportTransactions) {

        reportTransactions.textContent =
            sales.length;
    }


    /* -----------------------------
       FINANCIAL SUMMARY
    ----------------------------- */

    const financialRevenue =
        document.getElementById(
            "financialRevenue"
        );


    const financialCost =
        document.getElementById(
            "financialCost"
        );


    const financialProfit =
        document.getElementById(
            "financialProfit"
        );


    const cost =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(sale.total || 0) -
                Number(sale.profit || 0),
            0
        );


    if (financialRevenue) {

        financialRevenue.textContent =
            money(data.revenue);
    }


    if (financialCost) {

        financialCost.textContent =
            money(cost);
    }


    if (financialProfit) {

        financialProfit.textContent =
            money(data.profit);
    }


    renderBestSelling();
}


/* =========================================================
   21. BEST SELLING PRODUCTS
========================================================= */

function renderBestSelling() {

    const table =
        document.getElementById(
            "bestSellingTable"
        );


    if (!table) return;


    const productSales = {};


    sales.forEach(sale => {

        if (
            !productSales[
                sale.product
            ]
        ) {

            productSales[
                sale.product
            ] = {

                quantity: 0,

                revenue: 0,

                profit: 0
            };
        }


        productSales[
            sale.product
        ].quantity +=
            Number(
                sale.quantity || 0
            );


        productSales[
            sale.product
        ].revenue +=
            Number(
                sale.total || 0
            );


        productSales[
            sale.product
        ].profit +=
            Number(
                sale.profit || 0
            );
    });


    table.innerHTML = "";


    const sorted =
        Object.entries(
            productSales
        ).sort(
            (a, b) =>
                b[1].quantity -
                a[1].quantity
        );


    if (sorted.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    ">
                    No sales data available.
                </td>
            </tr>
        `;

        return;
    }


    sorted.forEach(
        ([product, data]) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${product}
                    </strong>
                </td>


                <td>
                    ${data.quantity}
                </td>


                <td>
                    ${money(
                        data.revenue
                    )}
                </td>


                <td>

                    <span class="positive">

                        ${money(
                            data.profit
                        )}

                    </span>

                </td>

            `;


            table.appendChild(row);
        }
    );
}/* =========================================================
   22. ADD PRODUCT
========================================================= */

document
    .getElementById("productForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById(
                        "productName"
                    )
                    .value
                    .trim();


            const category =
                document.getElementById(
                    "productCategory"
                ).value;


            const purchasePrice =
                Number(
                    document.getElementById(
                        "productPurchasePrice"
                    ).value
                );


            const sellingPrice =
                Number(
                    document.getElementById(
                        "productSellingPrice"
                    ).value
                );


            const stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value
                );


            const minimumStock =
                Number(
                    document.getElementById(
                        "productMinimumStock"
                    ).value
                );


            /* -----------------------------
               VALIDATION
            ----------------------------- */

            if (!name || !category) {

                showToast(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            if (
                purchasePrice < 0 ||
                sellingPrice < 0 ||
                stock < 0 ||
                minimumStock < 0
            ) {

                showToast(
                    "Please enter valid numbers.",
                    "error"
                );

                return;
            }


            if (
                sellingPrice <
                purchasePrice
            ) {

                showToast(
                    "Selling price is lower than purchase price.",
                    "error"
                );

                return;
            }


            /* -----------------------------
               ADD PRODUCT
            ----------------------------- */

            products.push({

                id: Date.now(),

                name:
                    name,

                category:
                    category,

                purchasePrice:
                    purchasePrice,

                sellingPrice:
                    sellingPrice,

                stock:
                    stock,

                minimumStock:
                    minimumStock
            });


            /* -----------------------------
               RESET
            ----------------------------- */

            this.reset();


            const minimumInput =
                document.getElementById(
                    "productMinimumStock"
                );


            if (minimumInput) {

                minimumInput.value = 5;
            }


            closeModal(
                "productModal"
            );


            /* -----------------------------
               UPDATE
            ----------------------------- */

            updateAll();


            showToast(
                "Product added successfully!"
            );
        }
    );


/* =========================================================
   23. ADD CATEGORY
========================================================= */

document
    .getElementById("categoryForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById(
                        "categoryName"
                    )
                    .value
                    .trim();


            if (!name) {

                showToast(
                    "Please enter category name.",
                    "error"
                );

                return;
            }


            /* Check duplicate category */

            const exists =
                categories.some(
                    category =>
                        category.name
                            .toLowerCase() ===
                        name.toLowerCase()
                );


            if (exists) {

                showToast(
                    "Category already exists.",
                    "error"
                );

                return;
            }


            categories.push({

                id: Date.now(),

                name:
                    name
            });


            this.reset();


            closeModal(
                "categoryModal"
            );


            updateAll();


            showToast(
                "Category added successfully!"
            );
        }
    );


/* =========================================================
   24. ADD SUPPLIER
========================================================= */

document
    .getElementById("supplierForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById(
                        "supplierName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "supplierPhone"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "supplierEmail"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "supplierAddress"
                    )
                    .value
                    .trim();


            if (!name || !phone) {

                showToast(
                    "Supplier name and phone are required.",
                    "error"
                );

                return;
            }


            suppliers.push({

                id: Date.now(),

                name:
                    name,

                phone:
                    phone,

                email:
                    email,

                address:
                    address
            });


            this.reset();


            closeModal(
                "supplierModal"
            );


            updateAll();


            showToast(
                "Supplier added successfully!"
            );
        }
    );


/* =========================================================
   25. GLOBAL SEARCH
========================================================= */

const globalSearch =
    document.getElementById(
        "globalSearch"
    );


function performGlobalSearch(
    keyword
) {

    keyword =
        keyword
            .toLowerCase()
            .trim();


    if (!keyword) {

        showToast(
            "Type something to search."
        );

        return;
    }


    /* -----------------------------
       SEARCH PRODUCT
    ----------------------------- */

    const product =
        products.find(
            p =>
                p.name
                    .toLowerCase()
                    .includes(keyword) ||

                p.category
                    .toLowerCase()
                    .includes(keyword)
        );


    if (product) {

        showPage(
            "products"
        );


        const productSearch =
            document.getElementById(
                "productSearch"
            );


        if (productSearch) {

            productSearch.value =
                keyword;
        }


        renderProducts();


        return;
    }


    /* -----------------------------
       SEARCH CATEGORY
    ----------------------------- */

    const category =
        categories.find(
            c =>
                c.name
                    .toLowerCase()
                    .includes(keyword)
        );


    if (category) {

        showPage(
            "categories"
        );

        return;
    }


    /* -----------------------------
       SEARCH SUPPLIER
    ----------------------------- */

    const supplier =
        suppliers.find(
            s =>
                s.name
                    .toLowerCase()
                    .includes(keyword) ||

                s.phone
                    .includes(keyword)
        );


    if (supplier) {

        showPage(
            "suppliers"
        );

        return;
    }


    /* -----------------------------
       SEARCH SALES
    ----------------------------- */

    const sale =
        sales.find(
            s =>
                s.customer
                    .toLowerCase()
                    .includes(keyword) ||

                s.product
                    .toLowerCase()
                    .includes(keyword)
        );


    if (sale) {

        showPage(
            "sales"
        );

        return;
    }


    showToast(
        "No matching result found.",
        "error"
    );
}


/* Search using ENTER */

globalSearch?.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Enter") {

            performGlobalSearch(
                this.value
            );
        }
    }
);


/* Search using search icon */

document
    .querySelector(
        ".search-box i"
    )
    ?.addEventListener(
        "click",
        function () {

            performGlobalSearch(
                globalSearch?.value || ""
            );
        }
    );


/* =========================================================
   26. NOTIFICATION SYSTEM
========================================================= */

const notificationButton =
    document.querySelector(
        ".notification-btn"
    );


/*
   Creates notification data from the
   actual products, sales and purchases.
*/

function getNotifications() {

    const notifications = [];


    /* -----------------------------
       LOW STOCK
    ----------------------------- */

    const lowStock =
        products.filter(
            p =>
                Number(p.stock) <=
                Number(p.minimumStock)
        );


    lowStock.forEach(
        product => {

            notifications.push({
    id: `stock-${product.id}`,
    type: "stock",
    title: "Low Stock Alert",
    text: `${product.name} has only ${product.stock} left.`,
    page: "products"
});
        }
    );


    /* -----------------------------
       LATEST SALE
    ----------------------------- */

    if (sales.length > 0) {

        const latestSale =
            sales[0];


      notifications.push({
    id: `sale-${latestSale.id}`,
    type: "sale",
    title: "Latest Sale",
    text: `${latestSale.customer} purchased ${latestSale.product}.`,
    page: "sales"
});
    }


    /* -----------------------------
       LATEST PURCHASE
    ----------------------------- */

    if (purchases.length > 0) {

        const latestPurchase =
            purchases[0];

notifications.push({
    id: `purchase-${latestPurchase.id}`,
    type: "purchase",
    title: "Latest Purchase",
    text: `${latestPurchase.product} stock was updated.`,
    page: "purchase"
});
    }


    return notifications;
}


/* =========================================================
   27. CREATE NOTIFICATION DROPDOWN
========================================================= */

function createNotificationDropdown() {

    if (!notificationButton) {
        return;
    }


    let dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (!dropdown) {

        dropdown =
            document.createElement(
                "div"
            );


        dropdown.id =
            "notificationDropdown";


        /* -----------------------------
           DROPDOWN STYLE
        ----------------------------- */

        dropdown.style.position =
            "absolute";

        dropdown.style.top =
            "50px";

        dropdown.style.right =
            "0";

        dropdown.style.width =
            "300px";

        dropdown.style.background =
            "#ffffff";

        dropdown.style.border =
            "1px solid #e5e7eb";

        dropdown.style.borderRadius =
            "12px";

        dropdown.style.boxShadow =
            "0 12px 30px rgba(0,0,0,.12)";

        dropdown.style.zIndex =
            "9999";

        dropdown.style.overflow =
            "hidden";


        if (
            notificationButton
                .parentElement
        ) {

            notificationButton
                .parentElement
                .style.position =
                "relative";


            notificationButton
                .parentElement
                .appendChild(
                    dropdown
                );
        }
    }


    renderNotifications();
}


/* =========================================================
   28. RENDER NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (!dropdown) {
        return;
    }


    const notifications =
        getNotifications();


    let html = `

        <div style="
            padding:14px 16px;
            border-bottom:1px solid #e5e7eb;
            font-weight:700;
            font-size:13px;
        ">

            Notifications

        </div>

    `;


    if (
        notifications.length === 0
    ) {

        html += `

            <div style="
                padding:25px;
                text-align:center;
                color:#6b7280;
                font-size:12px;
            ">

                No new notifications.

            </div>

        `;

    } else {

        notifications.forEach(
            (
                notification,
                index
            ) => {


                let icon =
                    "fa-bell";


                if (
                    notification.type ===
                    "stock"
                ) {

                    icon =
                        "fa-triangle-exclamation";

                } else if (
                    notification.type ===
                    "sale"
                ) {

                    icon =
                        "fa-cart-shopping";

                } else if (
                    notification.type ===
                    "purchase"
                ) {

                    icon =
                        "fa-box";
                }


                html += `

                    <button
                        type="button"
                        class="notification-item"
                        data-notification-index="${index}"
                        style="
                            width:100%;
                            border:0;
                            background:#fff;
                            text-align:left;
                            padding:13px 15px;
                            display:flex;
                            gap:11px;
                            cursor:pointer;
                            border-bottom:1px solid #f1f1f1;
                        "
                    >

                        <i
                            class="fa-solid ${icon}"
                            style="
                                color:var(--primary);
                                margin-top:2px;
                            "
                        ></i>


                        <span>

                            <strong
                                style="
                                    display:block;
                                    font-size:12px;
                                "
                            >

                                ${notification.title}

                            </strong>


                            <small
                                style="
                                    color:#6b7280;
                                    font-size:11px;
                                "
                            >

                                ${notification.text}

                            </small>

                        </span>

                    </button>

                `;
            }
        );
    }


    dropdown.innerHTML =
        html;
}


/* =========================================================
   29. NOTIFICATION BUTTON
========================================================= */

notificationButton?.addEventListener(
    "click",
    function (e) {

        e.stopPropagation();


        let dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (!dropdown) {

            createNotificationDropdown();


            dropdown =
                document.getElementById(
                    "notificationDropdown"
                );
        }


        if (dropdown) {

            if (
                dropdown.style.display ===
                "none"
            ) {

                renderNotifications();

                dropdown.style.display =
                    "block";

            } else {

                dropdown.style.display =
                    "none";
            }
        }
    }
);


/* =========================================================
   30. CLOSE NOTIFICATION WHEN
       CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (!dropdown) {
            return;
        }


        if (
            !dropdown.contains(
                e.target
            ) &&
            !notificationButton?.contains(
                e.target
            )
        ) {

            dropdown.style.display =
                "none";
        }
    }
);


/* =========================================================
   31. CLICK NOTIFICATION
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const item =
            e.target.closest(
                ".notification-item"
            );


        if (!item) {
            return;
        }


        const index =
            Number(
                item.dataset
                    .notificationIndex
            );


        const notification =
            getNotifications()[
                index
            ];
            if (
    !readNotifications.includes(
        notification.id
    )
) {
    readNotifications.push(
        notification.id
    );
}


        if (!notification) {
            return;
        }


        /* Go to relevant page */

        updateNotificationCount();

        showPage(
            notification.page
        );


        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (dropdown) {

            dropdown.style.display =
                "none";
        }
    }
);


/* =========================================================
   32. NOTIFICATION COUNT
========================================================= */

function updateNotificationCount() {

    if (!notificationButton) {
        return;
    }


    const badge =
        notificationButton.querySelector(
            "span"
        );


    if (!badge) {
        return;
    }


   const count =
    getNotifications().filter(
        notification =>
            !readNotifications.includes(
                notification.id
            )
    ).length;


    badge.textContent =
        count;


    badge.style.display =
        count > 0
            ? "flex"
            : "none";
}


/* =========================================================
   33. SETTINGS TABS
========================================================= */


/* =========================================================
   34. MOBILE MENU
========================================================= */
document
    .querySelectorAll(
        ".setting-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".setting-tab"
                        )
                        .forEach(
                            t =>
                                t.classList.remove(
                                    "active"
                                )
                        );

                    this.classList.add(
                        "active"
                    );

                    const name =
                        this.textContent
                            .trim();

                    if (
                        name !==
                        "Business Information"
                    ) {

                        showToast(
                            `${name} section can be connected when its fields are added.`
                        );
                    }
                }
            );
        }
    );

/* =========================================================
   35. UPDATE EVERYTHING
========================================================= */

function updateAll() {

    /* Products */

    renderProducts();


    /* Categories */

    renderCategories();


    /* Suppliers */

    renderSuppliers();


    /* Purchases */

    renderPurchases();


    /* Sales */

    renderSales();


    /* Dashboard */

    updateDashboard();


    /* Reports */

    updateReports();


    /* Product dropdowns */

    populateProductSelects();


    /* Supplier dropdown */

    populateSupplierSelect();


    /* Notifications */

    updateNotificationCount();


    /*
       Re-render notification content
       if dropdown already exists.
    */

    if (
        document.getElementById(
            "notificationDropdown"
        )
    ) {

        renderNotifications();
    }
}


/* =========================================================
   36. INITIAL PAGE LOAD
========================================================= */

updateAll();


/* Purchase calculation */

calculatePurchase();


/* Sales calculation */

updateSaleCalculation();


/* Break-even calculation */

calculateBreakEven();


/* =========================================================
   37. INITIAL NOTIFICATION SETUP
========================================================= */

createNotificationDropdown();


const initialNotificationDropdown =
    document.getElementById(
        "notificationDropdown"
    );


if (
    initialNotificationDropdown
) {

    initialNotificationDropdown.style.display =
        "none";
}


/* =========================================================
   38. DEFAULT PAGE
========================================================= */

/*
   Open Dashboard when the website starts.
*/

showPage(
    "dashboard"
);



/* =========================================================
   BUSINESS INFORMATION SAVE
========================================================= */

document
    .getElementById("saveBusinessInfo")
    ?.addEventListener("click", function () {

        const adminName =
            document.getElementById("adminName").value.trim();

        const phone =
            document.getElementById("businessPhone").value.trim();

        const email =
            document.getElementById("businessEmail").value.trim();

        const address =
            document.getElementById("businessAddress").value.trim();


        localStorage.setItem(
            "businessInfo",
            JSON.stringify({
                adminName: adminName,
                phone: phone,
                email: email,
                address: address
            })
        );
updateAdminName();

        showToast(
            "Business information saved successfully!"
        );

    });
    /* =========================================================
   LOAD BUSINESS INFORMATION
========================================================= */

function loadBusinessInfo() {

    const saved =
        localStorage.getItem("businessInfo");

    if (!saved) return;

    const info =
        JSON.parse(saved);


    document.getElementById("adminName").value =
        info.adminName || "";

    document.getElementById("businessPhone").value =
        info.phone || "";

    document.getElementById("businessEmail").value =
        info.email || "";

    document.getElementById("businessAddress").value =
        info.address || "";
}

loadBusinessInfo();


function updateAdminName() {

    const saved = localStorage.getItem("businessInfo");

    if (!saved) return;

    const info = JSON.parse(saved);

    const adminName = info.adminName || "Admin";


    // Change bottom-left admin name
    const sidebarAdmin =
        document.getElementById("sidebarAdminName");

    if (sidebarAdmin) {
        sidebarAdmin.textContent = adminName;
    }


    // Change top-right first letter
    const adminAvatar =
        document.getElementById("adminAvatar");

    if (adminAvatar) {
        adminAvatar.textContent =
            adminName.charAt(0).toUpperCase();
    }
}

// ================= BACKEND API =================

async function loadProductsFromDatabase() {
    try {
        const response = await fetch("backend/api/products.php");

        const result = await response.json();

        console.log("Products from database:", result);

        if (!result.success) {
            console.error("Database error:", result.message);
            return;
        }

        console.log("Products loaded:", result.data);

    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadProductsFromDatabase();
});