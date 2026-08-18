/* =========================================================
   7. SUPPLIERS
========================================================= */

function renderSuppliers() {

    const container =
        document.getElementById("supplierList");

    if (!container) return;

    container.innerHTML = "";

    if (suppliers.length === 0) {

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

        card.className = "supplier-card";

        card.innerHTML = `
            <div class="supplier-top">

                <div class="supplier-avatar">
                    ${supplier.name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <h3>${supplier.name}</h3>

                    <span>Supplier</span>
                </div>

            </div>

            <div class="supplier-info">

                <p>
                    <i class="fa-solid fa-phone"></i>
                    ${supplier.phone}
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
   9. SUPPLIER DROPDOWN
========================================================= */

function populateSupplierSelect() {

    const select =
        document.getElementById("purchaseSupplier");

    if (!select) return;

    const current =
        select.value;

    select.innerHTML = `
        <option value="">
            Select Supplier
        </option>
    `;

    suppliers.forEach(supplier => {

        const option =
            document.createElement("option");

        option.value = supplier.id;

        option.textContent =
            supplier.name;

        select.appendChild(option);
    });

    select.value = current;
}



/* =========================================================
   24. ADD SUPPLIER
========================================================= */

document
    .getElementById("supplierForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById(
                        "supplierName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "supplierPhone"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "supplierEmail"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "supplierAddress"
                    )
                    .value
                    .trim();


            if (!name || !phone) {

                showToast(
                    "Supplier name and phone are required.",
                    "error"
                );

                return;
            }


            suppliers.push({

                id: Date.now(),

                name:
                    name,

                phone:
                    phone,

                email:
                    email,

                address:
                    address
            });


            this.reset();


            closeModal(
                "supplierModal"
            );


            updateAll();


            showToast(
                "Supplier added successfully!"
            );
        }
    );


