/* =========================================================
   PURCHASE.JS
   Smart Retail Business Manager
   MySQL + PHP API
========================================================= */


/* =========================================================
   1. PURCHASE CALCULATION
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
   2. PURCHASE INPUT EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

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

    }
);


/* =========================================================
   3. ADD PURCHASE TO MYSQL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "purchaseForm"
            );

        if (!form) return;


        form.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                /* -------------------------
                   GET FORM DATA
                ------------------------- */

                const supplierId =
                    Number(
                        document.getElementById(
                            "purchaseSupplier"
                        )?.value
                    );


                const productId =
                    Number(
                        document.getElementById(
                            "purchaseProduct"
                        )?.value
                    );


                const quantity =
                    Number(
                        document.getElementById(
                            "purchaseQuantity"
                        )?.value
                    );


                const price =
                    Number(
                        document.getElementById(
                            "purchasePrice"
                        )?.value
                    );


                /* -------------------------
                   VALIDATION
                ------------------------- */

                if (
                    !supplierId ||
                    !productId
                ) {

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


                /* -------------------------
                   SEND TO PHP API
                ------------------------- */

                try {

                    const response =
                        await fetch(
                            `${API_BASE}/add_purchase.php`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        supplier_id:
                                            supplierId,

                                        product_id:
                                            productId,

                                        quantity:
                                            quantity,

                                        purchase_price:
                                            price

                                    })

                            }
                        );


                    const result =
                        await response.json();


                    /* -------------------------
                       API ERROR
                    ------------------------- */

                    if (!result.success) {

                        showToast(
                            result.message ||
                            "Purchase failed.",
                            "error"
                        );

                        return;
                    }


                    /* -------------------------
                       SUCCESS
                    ------------------------- */

                    showToast(
                        "Purchase added successfully!"
                    );


                    /* -------------------------
                       RESET FORM
                    ------------------------- */

                    form.reset();


                    const total =
                        document.getElementById(
                            "purchaseTotal"
                        );


                    if (total) {

                        total.textContent =
                            money(0);

                    }


                    /* -------------------------
                       RELOAD MYSQL DATA
                    ------------------------- */

                    if (
                        typeof loadAllDataFromDatabase ===
                        "function"
                    ) {

                        await loadAllDataFromDatabase();

                    }


                    /* -------------------------
                       UPDATE PAGE
                    ------------------------- */

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

                }
                catch (error) {

                    console.error(
                        "Purchase API error:",
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


/* =========================================================
   4. PURCHASE TABLE
========================================================= */

function renderPurchases() {

    const table =
        document.getElementById(
            "purchaseTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (
        !purchases ||
        purchases.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    "
                >

                    No purchases recorded yet.

                </td>

            </tr>

        `;

        return;
    }


    purchases.forEach(
        purchase => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${purchase.date || ""}
                </td>


                <td>
                    ${purchase.supplier || ""}
                </td>


                <td>
                    ${purchase.product || ""}
                </td>


                <td>
                    ${purchase.quantity || 0}
                </td>


                <td>
                    ${money(
                        purchase.price || 0
                    )}
                </td>


                <td>

                    <strong>
                        ${money(
                            purchase.total || 0
                        )}
                    </strong>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================================
   5. INITIAL PURCHASE CALCULATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            typeof calculatePurchase ===
            "function"
        ) {

            calculatePurchase();

        }

    }
);