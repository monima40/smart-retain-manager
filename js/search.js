/* =========================================================
   25. GLOBAL SEARCH
========================================================= */

const globalSearch =
    document.getElementById(
        "globalSearch"
    );


function performGlobalSearch(
    keyword
) {

    keyword =
        keyword
            .toLowerCase()
            .trim();


    if (!keyword) {

        showToast(
            "Type something to search."
        );

        return;
    }


    /* -----------------------------
       SEARCH PRODUCT
    ----------------------------- */

    const product =
        products.find(
            p =>
                p.name
                    .toLowerCase()
                    .includes(keyword) ||

                p.category
                    .toLowerCase()
                    .includes(keyword)
        );


    if (product) {

        showPage(
            "products"
        );


        const productSearch =
            document.getElementById(
                "productSearch"
            );


        if (productSearch) {

            productSearch.value =
                keyword;
        }


        renderProducts();


        return;
    }


    /* -----------------------------
       SEARCH CATEGORY
    ----------------------------- */

    const category =
        categories.find(
            c =>
                c.name
                    .toLowerCase()
                    .includes(keyword)
        );


    if (category) {

        showPage(
            "categories"
        );

        return;
    }


    /* -----------------------------
       SEARCH SUPPLIER
    ----------------------------- */

    const supplier =
        suppliers.find(
            s =>
                s.name
                    .toLowerCase()
                    .includes(keyword) ||

                s.phone
                    .includes(keyword)
        );


    if (supplier) {

        showPage(
            "suppliers"
        );

        return;
    }


    /* -----------------------------
       SEARCH SALES
    ----------------------------- */

    const sale =
        sales.find(
            s =>
                s.customer
                    .toLowerCase()
                    .includes(keyword) ||

                s.product
                    .toLowerCase()
                    .includes(keyword)
        );


    if (sale) {

        showPage(
            "sales"
        );

        return;
    }


    showToast(
        "No matching result found.",
        "error"
    );
}


/* Search using ENTER */

globalSearch?.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Enter") {

            performGlobalSearch(
                this.value
            );
        }
    }
);


/* Search using search icon */

document
    .querySelector(
        ".search-box i"
    )
    ?.addEventListener(
        "click",
        function () {

            performGlobalSearch(
                globalSearch?.value || ""
            );
        }
    );


