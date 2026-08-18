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
}
