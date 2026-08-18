/* =========================================================
   4. MODALS
========================================================= */

function openModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("show");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("show");
    }
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function (e) {
        if (e.target === this) {
            this.classList.remove("show");
        }
    });
});

