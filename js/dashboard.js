/* =========================================================
   16. BUSINESS DATA
========================================================= */

function calculateBusinessData() {

    const revenue =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    const profit =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.profit || 0
                ),
            0
        );


    const margin =
        revenue > 0
            ? (profit / revenue) * 100
            : 0;


    const lowStock =
        products.filter(
            product =>
                Number(product.stock) <=
                Number(product.minimumStock)
        );


    return {
        revenue,
        profit,
        margin,
        lowStock
    };
}



/* =========================================================
   17. DASHBOARD
========================================================= */

function updateDashboard() {

    const data =
        calculateBusinessData();


    const dashboardSales =
        document.getElementById(
            "dashboardSales"
        );


    const dashboardProfit =
        document.getElementById(
            "dashboardProfit"
        );


    const dashboardProducts =
        document.getElementById(
            "dashboardProducts"
        );


    const dashboardLowStock =
        document.getElementById(
            "dashboardLowStock"
        );


    if (dashboardSales) {

        dashboardSales.textContent =
            money(data.revenue);
    }


    if (dashboardProfit) {

        dashboardProfit.textContent =
            money(data.profit);
    }


    if (dashboardProducts) {

        dashboardProducts.textContent =
            products.length;
    }


    if (dashboardLowStock) {

        dashboardLowStock.textContent =
            data.lowStock.length;
    }


    /* -----------------------------
       PROFIT MARGIN
    ----------------------------- */

    const margin =
        document.getElementById(
            "profitMargin"
        );


    const marginRevenue =
        document.getElementById(
            "marginRevenue"
        );


    const marginProfit =
        document.getElementById(
            "marginProfit"
        );


    if (margin) {

        margin.textContent =
            data.margin.toFixed(1) + "%";
    }


    if (marginRevenue) {

        marginRevenue.textContent =
            money(data.revenue);
    }


    if (marginProfit) {

        marginProfit.textContent =
            money(data.profit);
    }


    /* -----------------------------
       PROFIT CIRCLE
    ----------------------------- */

    const circle =
        document.querySelector(
            ".profit-circle"
        );


    if (circle) {

        const degree =
            Math.min(
                360,
                Math.max(
                    0,
                    data.margin * 3.6
                )
            );


        circle.style.background = `
            conic-gradient(
                var(--primary)
                ${degree}deg,
                #ede9fe
                ${degree}deg
            )
        `;
    }


    renderLowStock();


    calculateBreakEven();
}



/* =========================================================
   18. LOW STOCK ALERT
========================================================= */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );


    if (!container) return;


    const lowProducts =
        products.filter(
            product =>
                Number(product.stock) <=
                Number(product.minimumStock)
        );


    container.innerHTML = "";


    if (lowProducts.length === 0) {

        container.innerHTML = `

            <div style="
                padding:20px;
                text-align:center;
                color:#16a34a;
                font-size:12px;
            ">

                <i class="fa-solid fa-circle-check"></i>

                All products have sufficient stock.

            </div>

        `;

        return;
    }


    lowProducts.forEach(product => {

        const item =
            document.createElement("div");


        item.className =
            "stock-item";


        item.innerHTML = `

            <div class="stock-product">

                <div class="product-mini-icon">

                    <i class="fa-solid fa-box"></i>

                </div>


                <div>

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.category}
                    </span>

                </div>

            </div>


            <div class="stock-number">

                ${product.stock} left

            </div>

        `;


        container.appendChild(item);
    });
}


