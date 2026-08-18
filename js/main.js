/* =========================================================
   35. UPDATE EVERYTHING
========================================================= */

function updateAll() {

    /* Persist current data so it carries over
       when the user moves to a different page. */

    saveAllData();


    /* Products */

    renderProducts();


    /* Categories */

    renderCategories();


    /* Suppliers */

    renderSuppliers();


    /* Purchases */

    renderPurchases();


    /* Sales */

    renderSales();


    /* Dashboard */

    updateDashboard();


    /* Reports */

    updateReports();


    /* Product dropdowns */

    populateProductSelects();


    /* Supplier dropdown */

    populateSupplierSelect();


    /* Notifications */

    updateNotificationCount();


    /*
       Re-render notification content
       if dropdown already exists.
    */

    if (
        document.getElementById(
            "notificationDropdown"
        )
    ) {

        renderNotifications();
    }
}



/* =========================================================
   36. INITIAL PAGE LOAD
========================================================= */

updateAll();


/* Purchase calculation */

calculatePurchase();


/* Sales calculation */

updateSaleCalculation();


/* Break-even calculation */

calculateBreakEven();



/* =========================================================
   37. INITIAL NOTIFICATION SETUP
========================================================= */

createNotificationDropdown();


const initialNotificationDropdown =
    document.getElementById(
        "notificationDropdown"
    );


if (
    initialNotificationDropdown
) {

    initialNotificationDropdown.style.display =
        "none";
}



/* =========================================================
   38. DEFAULT PAGE
   (No longer needed — each HTML file IS its own page now,
   so there's nothing to switch to on load.)
========================================================= */
