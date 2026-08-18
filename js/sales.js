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


