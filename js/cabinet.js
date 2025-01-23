let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
    arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

function calculateSideBarWidth() {
  const sidebarHeight =
    document.querySelector(".site-navbar-wrap").style.height +
    document.querySelector(".footer-basic").style.height;
  console.log(".site-navbar-wrap");
  console.log($(".site-navbar-wrap").height());
  console.log("footer-basic");
  console.log($(".footer-basic").height());
}

calculateSideBarWidth();
