/* =========================================================
   PRODUCTS.JS
   Smart Retail Business Manager
========================================================= */


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const table =
        document.getElementById("productsTable");

    if (!table) return;

    const search =
        document
            .getElementById("productSearch")
            ?.value
            .toLowerCase()
            .trim() || "";

    table.innerHTML = "";

    const filteredProducts =
        products.filter(product => {

            return (
                String(product.name)
                    .toLowerCase()
                    .includes(search)

                ||

                String(product.category)
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (filteredProducts.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    ">
                    No products found.
                </td>
            </tr>
        `;

    }


    filteredProducts.forEach(product => {

        const lowStock =
            Number(product.stock) <=
            Number(product.minimumStock);

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                ${money(product.purchasePrice)}
            </td>

            <td>
                ${money(product.sellingPrice)}
            </td>

            <td>
                ${product.stock}
            </td>

            <td>
                <span class="status ${
                    lowStock ? "low" : "good"
                }">

                    ${
                        lowStock
                            ? "Low Stock"
                            : "In Stock"
                    }

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

        productCount.textContent =
            products.length;

    }


    if (totalStock) {

        totalStock.textContent =
            products.reduce(
                (sum, product) =>
                    sum + Number(product.stock || 0),
                0
            );

    }


    if (productLowStock) {

        productLowStock.textContent =
            products.filter(
                product =>
                    Number(product.stock) <=
                    Number(product.minimumStock)
            ).length;

    }

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function deleteProduct(id) {

    const product =
        getProductById(id);

    if (!product) return;

    if (
        !confirm(
            `Delete ${product.name}?`
        )
    ) {
        return;
    }

    /*
       Currently remove from screen only.
    */

    products =
        products.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );

    updateAll();

    showToast(
        "Product removed from current view."
    );

}


/* =========================================================
   SEARCH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const search =
            document.getElementById(
                "productSearch"
            );

        if (search) {

            search.addEventListener(
                "input",
                renderProducts
            );

        }

    }
);


/* =========================================================
   DROPDOWN DATA
========================================================= */

function populateProductSelects() {

    const purchaseSelect =
        document.getElementById(
            "purchaseProduct"
        );

    const salesSelect =
        document.getElementById(
            "salesProduct"
        );

    const categorySelect =
        document.getElementById(
            "productCategory"
        );


    /* =====================================================
       PURCHASE PRODUCT
    ===================================================== */

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

            option.value =
                product.id;

            option.textContent =
                `${product.name} (${product.stock} in stock)`;

            purchaseSelect.appendChild(option);

        });

        purchaseSelect.value =
            current;

    }


    /* =====================================================
       SALES PRODUCT
    ===================================================== */

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

            option.value =
                product.id;

            option.textContent =
                `${product.name} (${product.stock} available)`;

            salesSelect.appendChild(option);

        });

        salesSelect.value =
            current;

    }


    /* =====================================================
       PRODUCT CATEGORY
    ===================================================== */

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

            option.value =
                category.id;

            option.textContent =
                category.name;

            categorySelect.appendChild(option);

        });

        categorySelect.value =
            current;

    }

}


/* =========================================================
   ADD PRODUCT → MYSQL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const productForm =
            document.getElementById(
                "productForm"
            );

        if (!productForm) return;


        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                const name =
                    document
                        .getElementById(
                            "productName"
                        )
                        ?.value
                        .trim();


                const categoryId =
                    Number(
                        document
                            .getElementById(
                                "productCategory"
                            )
                            ?.value || 0
                    );


                const purchasePrice =
                    Number(
                        document
                            .getElementById(
                                "productPurchasePrice"
                            )
                            ?.value || 0
                    );


                const sellingPrice =
                    Number(
                        document
                            .getElementById(
                                "productSellingPrice"
                            )
                            ?.value || 0
                    );


                const stock =
                    Number(
                        document
                            .getElementById(
                                "productStock"
                            )
                            ?.value || 0
                    );


                const minimumStock =
                    Number(
                        document
                            .getElementById(
                                "productMinimumStock"
                            )
                            ?.value || 5
                    );


                /* =========================
                   VALIDATION
                ========================= */

                if (!name || categoryId <= 0) {

                    showToast(
                        "Please select a category and enter product name.",
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
                        "Selling price cannot be lower than purchase price.",
                        "error"
                    );

                    return;

                }


                /* =========================
                   SEND TO PHP API
                ========================= */

                try {

                    const response =
                        await fetch(
                            `${API_BASE}/add_product.php`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        product_name:
                                            name,

                                        category_id:
                                            categoryId,

                                        purchase_price:
                                            purchasePrice,

                                        selling_price:
                                            sellingPrice,

                                        stock_quantity:
                                            stock,

                                        low_stock_limit:
                                            minimumStock

                                    })
                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "ADD PRODUCT RESPONSE:",
                        result
                    );


                    if (!result.success) {

                        showToast(
                            result.message ||
                            "Failed to add product.",
                            "error"
                        );

                        return;

                    }


                    /* =========================
                       SUCCESS
                    ========================= */

                    productForm.reset();


                    const minimumInput =
                        document.getElementById(
                            "productMinimumStock"
                        );


                    if (minimumInput) {

                        minimumInput.value = 5;

                    }


                    if (
                        typeof closeModal ===
                        "function"
                    ) {

                        closeModal(
                            "productModal"
                        );

                    }


                    showToast(
                        "Product added to MySQL successfully!"
                    );


                    /* =========================
                       RELOAD MYSQL DATA
                    ========================= */

                    await loadProductsFromDatabase();


                    updateAll();


                    populateProductSelects();


                } catch (error) {

                    console.error(
                        "ADD PRODUCT ERROR:",
                        error
                    );


                    showToast(
                        "Could not connect to the server.",
                        "error"
                    );

                }

            }
        );

    }
);