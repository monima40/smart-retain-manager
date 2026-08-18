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


