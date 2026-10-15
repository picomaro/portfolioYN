fetch("works.csv")
.then(function(response) {
    return response.text();
})
.then(function(data) {

    var rows = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
    if (rows.length < 2) return;

    var headers = rows[0].split(",").map(function(h) {
        return h.trim();
    });

    var works = rows.slice(1).filter(function(row) {
        return row.trim() !== "";
    }).map(function(row) {
        var values = row.split(",");
        var work = {};
        headers.forEach(function(header, index) {
            var val = values[index] !== undefined ? values[index].trim() : "";
            work[header] = val;
        });
        return work;
    });

    var grid = document.getElementById("works-grid");
    var categorySelect = document.getElementById("category");
    var sortSelect = document.getElementById("sort");

    if (!grid || !categorySelect || !sortSelect) return;

    var categories = [];
    works.forEach(function(work) {
        if (work.category && !categories.includes(work.category)) {
            categories.push(work.category);
        }
    });

    categories.forEach(function(category) {
        var option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    function updateDetail(work) {
        if (!work) return;
        var img = document.getElementById("detail-image");
        var category = document.getElementById("detail-category");
        var title = document.getElementById("detail-title");
        var description = document.getElementById("detail-description");
        var year = document.getElementById("detail-year");

        if (img) { img.src = work.image || ""; img.alt = work.title || ""; }
        if (category) category.textContent = work.category || "";
        if (title) title.textContent = work.title || "";
        if (description) description.textContent = work.description || "";
        if (year) year.textContent = work.year || "";
    }

    function displayWorks() {
        var selectedCategory = categorySelect.value;
        var sortType = sortSelect.value;
        var filteredWorks = works.slice();

        if (selectedCategory !== "all") {
            filteredWorks = filteredWorks.filter(function(work) {
                return work.category === selectedCategory;
            });
        }

        if (sortType === "new") {
            filteredWorks.sort(function(a, b) { return Number(b.year || 0) - Number(a.year || 0); });
        } else if (sortType === "old") {
            filteredWorks.sort(function(a, b) { return Number(a.year || 0) - Number(b.year || 0); });
        } else if (sortType === "title") {
            filteredWorks.sort(function(a, b) { return (a.title || "").localeCompare(b.title || "", "ja"); });
        }

        grid.innerHTML = "";

        filteredWorks.forEach(function(work, index) {
            var card = document.createElement("article");
            card.className = "work-card";

            var categoryText = work.category || "";
            var titleText = work.title || "";
            var descText = work.description || "";
            var yearText = work.year || "";
            var imageSrc = work.image || "";

            card.innerHTML =
                '<img src="' + imageSrc + '" alt="' + titleText + '">' +
                '<div class="work-info">' +
                    '<p class="work-category">' + categoryText + '</p>' +
                    '<h4>' + titleText + '</h4>' +
                    '<p>' + descText + '</p>' +
                    '<p class="work-year">' + yearText + '</p>' +
                '</div>';

            if (index === 0) {
                card.classList.add("selected");
            }

            card.addEventListener("click", function() {
                updateDetail(work);
                document.querySelectorAll(".work-card").forEach(function(c) {
                    c.classList.remove("selected");
                });
                card.classList.add("selected");
            });

            grid.appendChild(card);
        });

        if (filteredWorks.length > 0) {
            updateDetail(filteredWorks[0]);
        }
    }

    displayWorks();

    categorySelect.addEventListener("change", function() {
        displayWorks();
    });

    sortSelect.addEventListener("change", function() {
        displayWorks();
    });

}).catch(function(err) {
    console.log("CSV読み込みエラー:", err);
});

function initNavMenu() {
    var menu = document.getElementById("menu");
    var navMenu = document.getElementById("nav-menu");

    if (menu && navMenu) {
        menu.addEventListener("click", function() {
            menu.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        var navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(function(link) {
            link.addEventListener("click", function() {
                menu.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavMenu);
} else {
    initNavMenu();
}

function initSlider() {
    var track = document.getElementById("slider-track");
    var dotsContainer = document.getElementById("slider-dots");
    if (!track || !dotsContainer) return;

    var slides = track.querySelectorAll(".slide-img");
    var currentIndex = 0;
    var slideInterval;

    slides.forEach(function(slide) {
        slide.style.cursor = "pointer";
        slide.addEventListener("click", function() {
            location.href = "#works";
        });
    });

    slides.forEach(function(_, index) {
        var dot = document.createElement("span");
        dot.className = "dot" + (index === 0 ? " active" : "");
        
        dot.addEventListener("click", function() {
            goToSlide(index);
            resetTimer();
        });

        dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll(".dot");

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = "translateX(" + (-currentIndex * 100) + "%)";
        
        dots.forEach(function(dot, i) {
            if (i === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    function nextSlide() {
        var nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    startTimer();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlider);
} else {
    initSlider();
}