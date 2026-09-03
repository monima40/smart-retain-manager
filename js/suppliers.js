/* =========================================================
   SUPPLIERS.JS
   Smart Retail Business Manager
   MySQL + PHP API
========================================================= */


/* =========================================================
   1. RENDER SUPPLIERS
========================================================= */

function renderSuppliers() {

    const container =
        document.getElementById("supplierList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!suppliers || suppliers.length === 0) {

        container.innerHTML = `
            <div style="
                padding:25px;
                text-align:center;
                color:#6b7280;
            ">
                No suppliers added yet.
            </div>
        `;

        return;
    }


    suppliers.forEach(supplier => {

        const card =
            document.createElement("div");


        card.className =
            "supplier-card";


        const firstLetter =
            supplier.name
                ? supplier.name
                    .charAt(0)
                    .toUpperCase()
                : "S";


        card.innerHTML = `

            <div class="supplier-top">

                <div class="supplier-avatar">
                    ${firstLetter}
                </div>

                <div>

                    <h3>
                        ${supplier.name || "Unknown Supplier"}
                    </h3>

                    <span>
                        Supplier
                    </span>

                </div>

            </div>


            <div class="supplier-info">

                <p>
                    <i class="fa-solid fa-phone"></i>
                    ${supplier.phone || "No phone"}
                </p>

                <p>
                    <i class="fa-solid fa-envelope"></i>
                    ${supplier.email || "No email"}
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${supplier.address || "No address"}
                </p>

            </div>

        `;


        container.appendChild(card);

    });


    populateSupplierSelect();

}



/* =========================================================
   2. SUPPLIER DROPDOWN
========================================================= */

function populateSupplierSelect() {

    const select =
        document.getElementById(
            "purchaseSupplier"
        );


    if (!select) {
        return;
    }


    const currentValue =
        select.value;


    select.innerHTML = `

        <option value="">
            Select Supplier
        </option>

    `;


    if (!suppliers) {
        return;
    }


    suppliers.forEach(supplier => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            supplier.id;


        option.textContent =
            supplier.name;


        select.appendChild(
            option
        );

    });


    select.value =
        currentValue;

}



/* =========================================================
   3. ADD SUPPLIER → MYSQL
========================================================= */

/*
   IMPORTANT:

   We use document-level submit handling.

   This works even if the supplier form
   is added to the page dynamically.
*/

document.addEventListener(
    "submit",
    async function (e) {

        /* Only handle supplier form */

        if (
            !e.target ||
            e.target.id !== "supplierForm"
        ) {

            return;
        }


        e.preventDefault();


        console.log(
            "SUPPLIER FORM SUBMITTED"
        );


        /* =================================================
           GET FORM ELEMENTS
        ================================================= */

        const nameInput =
            document.getElementById(
                "supplierName"
            );


        const phoneInput =
            document.getElementById(
                "supplierPhone"
            );


        const emailInput =
            document.getElementById(
                "supplierEmail"
            );


        const addressInput =
            document.getElementById(
                "supplierAddress"
            );


        /* =================================================
           CHECK ELEMENTS
        ================================================= */

        if (!nameInput) {

            console.error(
                "supplierName input not found"
            );


            showToast(
                "Supplier name field not found.",
                "error"
            );


            return;
        }


        if (!phoneInput) {

            console.error(
                "supplierPhone input not found"
            );


            showToast(
                "Supplier phone field not found.",
                "error"
            );


            return;
        }


        /* =================================================
           GET VALUES
        ================================================= */

        const name =
            nameInput.value.trim();


        const phone =
            phoneInput.value.trim();


        const email =
            emailInput
                ? emailInput.value.trim()
                : "";


        const address =
            addressInput
                ? addressInput.value.trim()
                : "";


        console.log(
            "SUPPLIER DATA:",
            {
                name: name,
                phone: phone,
                email: email,
                address: address
            }
        );


        /* =================================================
           VALIDATION
        ================================================= */

        if (!name) {

            showToast(
                "Please enter supplier name.",
                "error"
            );


            return;
        }


        if (!phone) {

            showToast(
                "Please enter supplier phone.",
                "error"
            );


            return;
        }


        /* =================================================
           CREATE REQUEST DATA
        ================================================= */

        const supplierData = {

            supplier_name:
                name,

            phone:
                phone,

            email:
                email,

            address:
                address

        };


        console.log(
            "SENDING TO:",
            `${API_BASE}/add_suppliers.php`
        );


        console.log(
            "REQUEST BODY:",
            supplierData
        );


        /* =================================================
           SEND POST REQUEST
        ================================================= */

        try {

            const response =
                await fetch(
                    `${API_BASE}/add_suppliers.php`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                supplierData
                            )

                    }
                );


            console.log(
                "HTTP STATUS:",
                response.status
            );


            /* =================================================
               READ SERVER RESPONSE
            ================================================= */

            const responseText =
                await response.text();


            console.log(
                "RAW SERVER RESPONSE:",
                responseText
            );


            /* =================================================
               CHECK HTTP ERROR
            ================================================= */

            if (!response.ok) {

                console.error(
                    "SERVER ERROR:",
                    responseText
                );


                showToast(
                    `Server error: ${response.status}`,
                    "error"
                );


                return;
            }


            /* =================================================
               CONVERT RESPONSE TO JSON
            ================================================= */

            let result;


            try {

                result =
                    JSON.parse(
                        responseText
                    );

            }
            catch (jsonError) {

                console.error(
                    "INVALID JSON FROM PHP:",
                    responseText
                );


                showToast(
                    "PHP returned an invalid response.",
                    "error"
                );


                return;
            }


            console.log(
                "ADD SUPPLIER RESULT:",
                result
            );


            /* =================================================
               CHECK PHP RESULT
            ================================================= */

            if (!result.success) {

                showToast(
                    result.message ||
                    "Supplier could not be added.",
                    "error"
                );


                return;
            }


            /* =================================================
               SUCCESS
            ================================================= */

            showToast(
                "Supplier added successfully!"
            );


            console.log(
                "Supplier ID:",
                result.supplier_id
            );


            /* =================================================
               RESET FORM
            ================================================= */

            e.target.reset();


            /* =================================================
               CLOSE MODAL
            ================================================= */

            if (
                typeof closeModal ===
                "function"
            ) {

                closeModal(
                    "supplierModal"
                );

            }


            /* =================================================
               LOAD SUPPLIERS AGAIN FROM MYSQL
            ================================================= */

            console.log(
                "Reloading suppliers from MySQL..."
            );


            await loadSuppliersFromDatabase();


            console.log(
                "SUPPLIERS AFTER ADD:",
                suppliers
            );


            /* =================================================
               UPDATE SUPPLIER PAGE
            ================================================= */

            renderSuppliers();


            /* =================================================
               UPDATE PURCHASE DROPDOWN
            ================================================= */

            populateSupplierSelect();


            /* =================================================
               UPDATE WHOLE APPLICATION
            ================================================= */

            if (
                typeof updateAll ===
                "function"
            ) {

                updateAll();

            }


        }
        catch (error) {

            console.error(
                "ADD SUPPLIER ERROR:",
                error
            );


            showToast(
                "Could not connect to the server.",
                "error"
            );

        }

    }
);



/* =========================================================
   4. INITIAL SUPPLIER DISPLAY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Suppliers.js loaded."
        );


        /*
           Data.js normally loads suppliers
           from MySQL and then calls updateAll().
        */

        if (
            typeof suppliers !==
            "undefined"
        ) {

            console.log(
                "Current suppliers:",
                suppliers
            );

        }


        if (
            typeof populateSupplierSelect ===
            "function"
        ) {

            populateSupplierSelect();

        }

    }
);