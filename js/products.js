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


