/* =========================================================
   CATEGORIES.JS
   Smart Retail Business Manager
========================================================= */


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories() {

    const container =
        document.getElementById("categoryList");

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

        const count =
            products.filter(product =>
                product.category === category.name
            ).length;


        const card =
            document.createElement("div");

        card.className = "category-card";


        card.innerHTML = `
            <div class="category-icon">
                <i class="fa-solid fa-layer-group"></i>
            </div>

            <h3>${category.name}</h3>

            <p>
                ${count}
                product${count !== 1 ? "s" : ""}
            </p>
        `;


        container.appendChild(card);

    });

}


/* =========================================================
   ADD CATEGORY → MYSQL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const categoryForm =
            document.getElementById(
                "categoryForm"
            );


        if (!categoryForm) {

            console.log(
                "categoryForm not found"
            );

            return;
        }


        categoryForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                const input =
                    document.getElementById(
                        "categoryName"
                    );


                const name =
                    input
                        ? input.value.trim()
                        : "";


                if (!name) {

                    showToast(
                        "Please enter category name.",
                        "error"
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            `${API_BASE}/add_category.php`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        category_name:
                                            name
                                    })
                            }
                        );


                    const result =
                        await response.json();


                    console.log(
                        "ADD CATEGORY RESULT:",
                        result
                    );


                    if (!result.success) {

                        showToast(
                            result.message ||
                            "Category could not be added.",
                            "error"
                        );

                        return;
                    }


                    /* =========================
                       RELOAD FROM MYSQL
                    ========================= */

                    await loadCategoriesFromDatabase();


                    renderCategories();


                    populateProductSelects();


                    updateAll();


                    categoryForm.reset();


                    if (
                        typeof closeModal ===
                        "function"
                    ) {

                        closeModal(
                            "categoryModal"
                        );

                    }


                    showToast(
                        "Category added successfully!"
                    );

                }
                catch (error) {

                    console.error(
                        "CATEGORY ERROR:",
                        error
                    );


                    showToast(
                        "Server connection error.",
                        "error"
                    );

                }

            }
        );

    }
);


/* =========================================================
   LOAD CATEGORIES WHEN PAGE OPENS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadCategoriesFromDatabase();

        renderCategories();

        if (
            typeof populateProductSelects ===
            "function"
        ) {

            populateProductSelects();

        }

    }
);