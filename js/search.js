/* =========================================================
   SEARCH.JS
   Smart Retail Business Manager
   GLOBAL HEADER SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const globalSearch =
        document.getElementById("globalSearch");

    if (!globalSearch) {
        console.log("globalSearch not found.");
        return;
    }

    console.log("Global search connected.");

    globalSearch.addEventListener("input", function () {

        const text =
            this.value.trim().toLowerCase();

        console.log("Global search:", text);


        /* =================================================
           PRODUCTS
        ================================================= */

        const productTable =
            document.getElementById("productsTable");

        if (productTable) {

            const productSearch =
                document.getElementById("productSearch");

            if (productSearch) {

                productSearch.value = text;

                productSearch.dispatchEvent(
                    new Event("input")
                );

            }

            return;
        }


        /* =================================================
           SUPPLIERS
        ================================================= */

        const supplierList =
            document.getElementById("supplierList");

        if (supplierList) {

            searchSupplierList(text);

            return;
        }


        /* =================================================
           CATEGORIES
        ================================================= */

        const categoryList =
            document.getElementById("categoryList");

        if (categoryList) {

            searchCategoryList(text);

            return;
        }


        /* =================================================
           OTHER PAGES
        ================================================= */

        console.log(
            "Global search is not configured for this page."
        );

    });

});


/* =========================================================
   SUPPLIER SEARCH
========================================================= */

function searchSupplierList(text) {

    const container =
        document.getElementById("supplierList");

    if (!container) return;


    /* Empty search = show all */

    if (text === "") {

        if (
            typeof renderSuppliers ===
            "function"
        ) {

            renderSuppliers();

        }

        return;
    }


    const result =
        suppliers.filter(function (supplier) {

            const name =
                String(
                    supplier.name || ""
                ).toLowerCase();

            const phone =
                String(
                    supplier.phone || ""
                ).toLowerCase();

            const email =
                String(
                    supplier.email || ""
                ).toLowerCase();

            const address =
                String(
                    supplier.address || ""
                ).toLowerCase();


            return (
                name.includes(text) ||
                phone.includes(text) ||
                email.includes(text) ||
                address.includes(text)
            );

        });


    container.innerHTML = "";


    if (result.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                width: 100%;
                padding: 30px;
                text-align: center;
                color: #6b7280;
            ">
                No suppliers found.
            </div>
        `;

        return;
    }


    result.forEach(function (supplier) {

        const card =
            document.createElement("div");

        card.className =
            "supplier-card";


        const name =
            supplier.name ||
            "Unknown Supplier";


        const firstLetter =
            name.charAt(0).toUpperCase();


        card.innerHTML = `

            <div class="supplier-top">

                <div class="supplier-avatar">
                    ${firstLetter}
                </div>

                <div>

                    <h3>
                        ${name}
                    </h3>

                    <span>
                        Supplier
                    </span>

                </div>

            </div>


            <div class="supplier-info">

                <p>
                    <i class="fa-solid fa-phone"></i>
                    ${supplier.phone || "No phone"}
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

}


/* =========================================================
   CATEGORY SEARCH
========================================================= */

function searchCategoryList(text) {

    const container =
        document.getElementById("categoryList");

    if (!container) return;


    /* Empty search = show all */

    if (text === "") {

        if (
            typeof renderCategories ===
            "function"
        ) {

            renderCategories();

        }

        return;
    }


    const result =
        categories.filter(function (category) {

            const name =
                String(
                    category.name || ""
                ).toLowerCase();

            return name.includes(text);

        });


    container.innerHTML = "";


    if (result.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                width: 100%;
                padding: 30px;
                text-align: center;
                color: #6b7280;
            ">
                No categories found.
            </div>
        `;

        return;
    }


    result.forEach(function (category) {

        const count =
            products.filter(function (product) {

                return (
                    product.category ===
                    category.name
                );

            }).length;


        const card =
            document.createElement("div");

        card.className =
            "category-card";


        card.innerHTML = `

            <div class="category-icon">

                <i class="fa-solid fa-layer-group"></i>

            </div>

            <h3>
                ${category.name}
            </h3>

            <p>
                ${count}
                product${count !== 1 ? "s" : ""}
            </p>

        `;


        container.appendChild(card);

    });

}