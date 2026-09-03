/* =========================================================
   33. SETTINGS TABS
========================================================= */

document
    .querySelectorAll(
        ".setting-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".setting-tab"
                        )
                        .forEach(
                            t =>
                                t.classList.remove(
                                    "active"
                                )
                        );

                    this.classList.add(
                        "active"
                    );

                    const name =
                        this.textContent
                            .trim();

                    if (
                        name !==
                        "Business Information"
                    ) {

                        showToast(
                            `${name} section can be connected when its fields are added.`
                        );
                    }
                }
            );
        }
    );


/* =========================================================
   BUSINESS INFORMATION SAVE
========================================================= */

document
    .getElementById("saveBusinessInfo")
    ?.addEventListener("click", function () {

        const adminName =
            document.getElementById("adminName").value.trim();

        const phone =
            document.getElementById("businessPhone").value.trim();

        const email =
            document.getElementById("businessEmail").value.trim();

        const address =
            document.getElementById("businessAddress").value.trim();


        localStorage.setItem(
            "businessInfo",
            JSON.stringify({
                adminName: adminName,
                phone: phone,
                email: email,
                address: address
            })
        );
updateAdminName();

        showToast(
            "Business information saved successfully!"
        );

    });
    /* =========================================================
   LOAD BUSINESS INFORMATION
========================================================= */

function loadBusinessInfo() {

    const saved =
        localStorage.getItem("businessInfo");

    if (!saved) return;

    const info =
        JSON.parse(saved);

    /* These fields only exist on settings.html, so guard
       each one (this function still runs on every page). */

    const adminNameField = document.getElementById("adminName");
    if (adminNameField) adminNameField.value = info.adminName || "";

    const businessPhoneField = document.getElementById("businessPhone");
    if (businessPhoneField) businessPhoneField.value = info.phone || "";

    const businessEmailField = document.getElementById("businessEmail");
    if (businessEmailField) businessEmailField.value = info.email || "";

    const businessAddressField = document.getElementById("businessAddress");
    if (businessAddressField) businessAddressField.value = info.address || "";
}

loadBusinessInfo();


function updateAdminName() {

    const saved = localStorage.getItem("businessInfo");

    if (!saved) return;

    const info = JSON.parse(saved);

    const adminName = info.adminName || "Admin";


    // Change bottom-left admin name
    const sidebarAdmin =
        document.getElementById("sidebarAdminName");

    if (sidebarAdmin) {
        sidebarAdmin.textContent = adminName;
    }


    // Change top-right first letter
    const adminAvatar =
        document.getElementById("adminAvatar");

    if (adminAvatar) {
        adminAvatar.textContent =
            adminName.charAt(0).toUpperCase();
    }
}
