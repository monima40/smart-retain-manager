

/* =========================================================
   26. NOTIFICATION SYSTEM
========================================================= */

const notificationButton =
    document.querySelector(
        ".notification-btn"
    );


/*
   Creates notification data from the
   actual products, sales and purchases.
*/

function getNotifications() {

    const notifications = [];


    /* -----------------------------
       LOW STOCK
    ----------------------------- */

    const lowStock =
        products.filter(
            p =>
                Number(p.stock) <=
                Number(p.minimumStock)
        );


    lowStock.forEach(
        product => {

            notifications.push({
    id: `stock-${product.id}`,
    type: "stock",
    title: "Low Stock Alert",
    text: `${product.name} has only ${product.stock} left.`,
    page: "products"
});
        }
    );


    /* -----------------------------
       LATEST SALE
    ----------------------------- */

    if (sales.length > 0) {

        const latestSale =
            sales[0];


      notifications.push({
    id: `sale-${latestSale.id}`,
    type: "sale",
    title: "Latest Sale",
    text: `${latestSale.customer} purchased ${latestSale.product}.`,
    page: "sales"
});
    }


    /* -----------------------------
       LATEST PURCHASE
    ----------------------------- */

    if (purchases.length > 0) {

        const latestPurchase =
            purchases[0];

notifications.push({
    id: `purchase-${latestPurchase.id}`,
    type: "purchase",
    title: "Latest Purchase",
    text: `${latestPurchase.product} stock was updated.`,
    page: "purchase"
});
    }


    return notifications;
}



/* =========================================================
   27. CREATE NOTIFICATION DROPDOWN
========================================================= */

function createNotificationDropdown() {

    if (!notificationButton) {
        return;
    }


    let dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (!dropdown) {

        dropdown =
            document.createElement(
                "div"
            );


        dropdown.id =
            "notificationDropdown";


        /* -----------------------------
           DROPDOWN STYLE
        ----------------------------- */

        dropdown.style.position =
            "absolute";

        dropdown.style.top =
            "50px";

        dropdown.style.right =
            "0";

        dropdown.style.width =
            "300px";

        dropdown.style.background =
            "#ffffff";

        dropdown.style.border =
            "1px solid #e5e7eb";

        dropdown.style.borderRadius =
            "12px";

        dropdown.style.boxShadow =
            "0 12px 30px rgba(0,0,0,.12)";

        dropdown.style.zIndex =
            "9999";

        dropdown.style.overflow =
            "hidden";


        if (
            notificationButton
                .parentElement
        ) {

            notificationButton
                .parentElement
                .style.position =
                "relative";


            notificationButton
                .parentElement
                .appendChild(
                    dropdown
                );
        }
    }


    renderNotifications();
}



/* =========================================================
   28. RENDER NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (!dropdown) {
        return;
    }


    const notifications =
        getNotifications();


    let html = `

        <div style="
            padding:14px 16px;
            border-bottom:1px solid #e5e7eb;
            font-weight:700;
            font-size:13px;
        ">

            Notifications

        </div>

    `;


    if (
        notifications.length === 0
    ) {

        html += `

            <div style="
                padding:25px;
                text-align:center;
                color:#6b7280;
                font-size:12px;
            ">

                No new notifications.

            </div>

        `;

    } else {

        notifications.forEach(
            (
                notification,
                index
            ) => {


                let icon =
                    "fa-bell";


                if (
                    notification.type ===
                    "stock"
                ) {

                    icon =
                        "fa-triangle-exclamation";

                } else if (
                    notification.type ===
                    "sale"
                ) {

                    icon =
                        "fa-cart-shopping";

                } else if (
                    notification.type ===
                    "purchase"
                ) {

                    icon =
                        "fa-box";
                }


                html += `

                    <button
                        type="button"
                        class="notification-item"
                        data-notification-index="${index}"
                        style="
                            width:100%;
                            border:0;
                            background:#fff;
                            text-align:left;
                            padding:13px 15px;
                            display:flex;
                            gap:11px;
                            cursor:pointer;
                            border-bottom:1px solid #f1f1f1;
                        "
                    >

                        <i
                            class="fa-solid ${icon}"
                            style="
                                color:var(--primary);
                                margin-top:2px;
                            "
                        ></i>


                        <span>

                            <strong
                                style="
                                    display:block;
                                    font-size:12px;
                                "
                            >

                                ${notification.title}

                            </strong>


                            <small
                                style="
                                    color:#6b7280;
                                    font-size:11px;
                                "
                            >

                                ${notification.text}

                            </small>

                        </span>

                    </button>

                `;
            }
        );
    }


    dropdown.innerHTML =
        html;
}



/* =========================================================
   29. NOTIFICATION BUTTON
========================================================= */

notificationButton?.addEventListener(
    "click",
    function (e) {

        e.stopPropagation();


        let dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (!dropdown) {

            createNotificationDropdown();


            dropdown =
                document.getElementById(
                    "notificationDropdown"
                );
        }


        if (dropdown) {

            if (
                dropdown.style.display ===
                "none"
            ) {

                renderNotifications();

                dropdown.style.display =
                    "block";

            } else {

                dropdown.style.display =
                    "none";
            }
        }
    }
);



/* =========================================================
   30. CLOSE NOTIFICATION WHEN
       CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (!dropdown) {
            return;
        }


        if (
            !dropdown.contains(
                e.target
            ) &&
            !notificationButton?.contains(
                e.target
            )
        ) {

            dropdown.style.display =
                "none";
        }
    }
);



/* =========================================================
   31. CLICK NOTIFICATION
========================================================= */

document.addEventListener(
    "click",
    function (e) {

        const item =
            e.target.closest(
                ".notification-item"
            );


        if (!item) {
            return;
        }


        const index =
            Number(
                item.dataset
                    .notificationIndex
            );


        const notification =
            getNotifications()[
                index
            ];
            if (
    !readNotifications.includes(
        notification.id
    )
) {
    readNotifications.push(
        notification.id
    );
}


        if (!notification) {
            return;
        }


        /* Go to relevant page */

        saveAllData();
        updateNotificationCount();

        showPage(
            notification.page
        );


        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        if (dropdown) {

            dropdown.style.display =
                "none";
        }
    }
);



/* =========================================================
   32. NOTIFICATION COUNT
========================================================= */

function updateNotificationCount() {

    if (!notificationButton) {
        return;
    }


    const badge =
        notificationButton.querySelector(
            "span"
        );


    if (!badge) {
        return;
    }


   const count =
    getNotifications().filter(
        notification =>
            !readNotifications.includes(
                notification.id
            )
    ).length;


    badge.textContent =
        count;


    badge.style.display =
        count > 0
            ? "flex"
            : "none";
}


