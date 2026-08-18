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

