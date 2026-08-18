/* =========================================================
   PAGE NAVIGATION

   The project is now split into real, separate HTML pages
   (dashboard.html, products.html, ...). Each sidebar link
   already points straight at the right file with a normal
   href, so no click-handling JS is needed for that.

   showPage() is kept only because other parts of the app
   (the "New Sale" button, search results, notification
   clicks) call showPage('sales') etc. programmatically. It
   now simply navigates to that page.
========================================================= */

function showPage(pageName) {
    window.location.href = pageName + ".html";
}
