/* =========================================================
   DASHBOARD.JS
   Smart Retail Business Manager
   MySQL Dashboard
========================================================= */


/* =========================================================
   1. CALCULATE BUSINESS DATA
========================================================= */

function calculateBusinessData() {

    const revenue = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.total || 0),
        0
    );


    const profit = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.profit || 0),
        0
    );


    const margin =
        revenue > 0
            ? (profit / revenue) * 100
            : 0;


    const lowStock = products.filter(
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
   2. UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const data =
        calculateBusinessData();


    /* =====================================================
       TOTAL SALES
    ===================================================== */

    const dashboardSales =
        document.getElementById(
            "dashboardSales"
        );


    if (dashboardSales) {

        dashboardSales.textContent =
            money(data.revenue);

    }


    /* =====================================================
       TOTAL PROFIT
    ===================================================== */

    const dashboardProfit =
        document.getElementById(
            "dashboardProfit"
        );


    if (dashboardProfit) {

        dashboardProfit.textContent =
            money(data.profit);

    }


    /* =====================================================
       TOTAL PRODUCTS
    ===================================================== */

    const dashboardProducts =
        document.getElementById(
            "dashboardProducts"
        );


    if (dashboardProducts) {

        dashboardProducts.textContent =
            products.length;

    }


    /* =====================================================
       LOW STOCK
    ===================================================== */

    const dashboardLowStock =
        document.getElementById(
            "dashboardLowStock"
        );


    if (dashboardLowStock) {

        dashboardLowStock.textContent =
            data.lowStock.length;

    }


    /* =====================================================
       PROFIT MARGIN
    ===================================================== */

    const margin =
        document.getElementById(
            "profitMargin"
        );


    if (margin) {

        margin.textContent =
            data.margin.toFixed(1) + "%";

    }


    /* =====================================================
       REVENUE
    ===================================================== */

    const marginRevenue =
        document.getElementById(
            "marginRevenue"
        );


    if (marginRevenue) {

        marginRevenue.textContent =
            money(data.revenue);

    }


    /* =====================================================
       PROFIT
    ===================================================== */

    const marginProfit =
        document.getElementById(
            "marginProfit"
        );


    if (marginProfit) {

        marginProfit.textContent =
            money(data.profit);

    }


    /* =====================================================
       PROFIT CIRCLE
    ===================================================== */

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


        circle.style.background =
            `
            conic-gradient(
                var(--primary)
                ${degree}deg,
                #ede9fe
                ${degree}deg
            )
            `;

    }


    /* =====================================================
       LOW STOCK LIST
    ===================================================== */

    renderLowStock();


    /* =====================================================
       BUSINESS PERFORMANCE
    ===================================================== */

    updateBusinessPerformance();

}


/* =========================================================
   3. LOW STOCK ALERT
========================================================= */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );


    if (!container) {
        return;
    }


    const lowProducts =
        products.filter(
            product =>
                Number(product.stock) <=
                Number(product.minimumStock)
        );


    container.innerHTML = "";


    /* =====================================================
       NO LOW STOCK
    ===================================================== */

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


    /* =====================================================
       LOW STOCK PRODUCTS
    ===================================================== */

    lowProducts.forEach(product => {

        const item =
            document.createElement(
                "div"
            );


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


/* =========================================================
   4. BUSINESS PERFORMANCE
========================================================= */

function updateBusinessPerformance() {

    const performanceSales =
        document.getElementById(
            "performanceSales"
        );


    const performanceProgress =
        document.getElementById(
            "performanceProgress"
        );


    const performanceText =
        document.getElementById(
            "performanceText"
        );


    const data =
        calculateBusinessData();


    if (performanceSales) {

        performanceSales.textContent =
            money(data.revenue);

    }


    /*
       Simple progress indicator.

       It is not a mathematical break-even
       calculation because the database does
       not contain fixed-cost information.
    */

    const target = 100000;


    const progress =
        Math.min(
            100,
            (data.revenue / target) * 100
        );


    if (performanceProgress) {

        performanceProgress.style.width =
            progress + "%";

    }


    if (performanceText) {

        if (data.revenue === 0) {

            performanceText.textContent =
                "Add sales to see your business progress.";

        } else {

            performanceText.textContent =
                `${progress.toFixed(0)}% of ৳ 100,000 sales target reached.`;

        }

    }

}


/* =========================================================
   5. SALES PERIOD
========================================================= */

function filterDashboardSales(period) {

    if (!sales || sales.length === 0) {

        return [];

    }


    const now =
        new Date();


    return sales.filter(sale => {

        if (!sale.date) {
            return false;
        }


        const saleDate =
            new Date(
                sale.date
            );


        if (isNaN(saleDate)) {
            return false;
        }


        if (period === "month") {

            return (
                saleDate.getMonth() ===
                now.getMonth()
                &&
                saleDate.getFullYear() ===
                now.getFullYear()
            );

        }


        if (period === "year") {

            return (
                saleDate.getFullYear() ===
                now.getFullYear()
            );

        }


        return true;

    });

}


/* =========================================================
   6. SALES PERIOD EVENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const salesPeriod =
            document.getElementById(
                "salesPeriod"
            );


        if (!salesPeriod) {
            return;
        }


        salesPeriod.addEventListener(
            "change",
            function () {

                const selected =
                    this.value;


                const filtered =
                    filterDashboardSales(
                        selected
                    );


                const revenue =
                    filtered.reduce(
                        (sum, sale) =>
                            sum +
                            Number(
                                sale.total || 0
                            ),
                        0
                    );


                const profit =
                    filtered.reduce(
                        (sum, sale) =>
                            sum +
                            Number(
                                sale.profit || 0
                            ),
                        0
                    );


                console.log(
                    "Selected sales period:",
                    selected
                );


                console.log(
                    "Revenue:",
                    revenue
                );


                console.log(
                    "Profit:",
                    profit
                );

            }
        );

    }
);