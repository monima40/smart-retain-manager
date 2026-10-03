/* =========================================================
   SALES.JS
   Smart Retail Business Manager
   MySQL + PHP API
========================================================= */


/* =========================================================
   1. SALES CALCULATION
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


    if (!product) {

        if (unitPrice)
            unitPrice.textContent = money(0);

        if (subtotalEl)
            subtotalEl.textContent = money(0);

        if (discountEl)
            discountEl.textContent = money(discount);

        if (totalEl)
            totalEl.textContent = money(0);

        if (profitEl)
            profitEl.textContent = money(0);

        return;
    }


    const subtotal =
        product.sellingPrice *
        quantity;


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    const profit =
        (
            product.sellingPrice -
            product.purchasePrice
        ) * quantity - discount;


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
   2. INPUT EVENTS
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
   3. SALES FORM
========================================================= */

document
    .getElementById("salesForm")
    ?.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const customerName =
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


            const paymentMethod =
                document.getElementById(
                    "paymentMethod"
                ).value;


            const product =
                getProductById(
                    productId
                );


            /* =========================
               VALIDATION
            ========================= */

            if (!customerName) {

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
                    "Discount cannot be greater than subtotal.",
                    "error"
                );

                return;
            }


            /* =================================================
               IMPORTANT:
               FIND CUSTOMER IN MYSQL
            ================================================= */

            let customerId = 0;


            const existingCustomer =
                customers.find(
                    customer =>
                        customer.name
                            .toLowerCase() ===
                        customerName.toLowerCase()
                );


            if (existingCustomer) {

                customerId =
                    Number(
                        existingCustomer.id
                    );

            }
            else {

                /* =============================================
                   CREATE CUSTOMER IN MYSQL
                ============================================= */

                try {

                    const customerResponse =
                        await fetch(
                            `${API_BASE}/add_customer.php`,
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        customer_name:
                                            customerName,

                                        phone:
                                            phone

                                    })

                            }
                        );


                    const customerResult =
                        await customerResponse.json();


                    if (
                        !customerResult.success
                    ) {

                        showToast(
                            customerResult.message ||
                            "Could not create customer.",
                            "error"
                        );

                        return;
                    }


                    customerId =
                        Number(
                            customerResult.customer_id
                        );


                    customers.unshift({

                        id:
                            customerId,

                        name:
                            customerName,

                        phone:
                            phone

                    });

                }
                catch (error) {

                    console.error(
                        error
                    );


                    showToast(
                        "Customer API error.",
                        "error"
                    );

                    return;

                }

            }


            /* =================================================
               SAVE SALE TO MYSQL
            ================================================= */

            try {

                const response =
                    await fetch(
                        `${API_BASE}/add_sale.php`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    customer_id:
                                        customerId,

                                    product_id:
                                        productId,

                                    quantity:
                                        quantity,

                                    discount:
                                        discount,

                                    payment_method:
                                        paymentMethod

                                })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "ADD SALE RESPONSE:",
                    result
                );


                if (!result.success) {

                    showToast(
                        result.message ||
                        "Sale could not be saved.",
                        "error"
                    );

                    return;
                }


                /* =================================================
                   SUCCESS
                ================================================= */

                showToast(
                    "Sale saved successfully!"
                );


                /* =================================================
                   RELOAD EVERYTHING FROM MYSQL
                ================================================= */

                await loadAllDataFromDatabase();


                updateAll();


                /* =================================================
                   RESET FORM
                ================================================= */

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

            }
            catch (error) {

                console.error(
                    "SALE ERROR:",
                    error
                );


                showToast(
                    "Could not connect to sale API.",
                    "error"
                );

            }

        }
    );


/* =========================================================
   4. RENDER SALES
========================================================= */

function renderSales() {

    const table =
        document.getElementById(
            "salesTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (
        !sales ||
        sales.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#6b7280;
                    "
                >

                    No sales recorded yet.

                </td>

            </tr>

        `;

        return;
    }


    sales.forEach(
        sale => {

            const row =
                document.createElement(
                    "tr"
                );


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


            table.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   5. CLEAR SALES
========================================================= */

function clearSales() {

    if (
        !confirm(
            "Are you sure you want to clear sales history?"
        )
    ) {

        return;

    }


    showToast(
        "Sales are stored in MySQL and cannot be cleared from the browser."
    );

}