

window.addEventListener('DOMContentLoaded', event => {

    var countvisitor = function () {
    const visitorCountElement = document.getElementById('visitorCount');

    // Fetch the visitor count from the server
    fetch('/getVisitorCount')
        .then(response => response.json())
        .then(data => {
            // Update the visitor count on the page
            visitorCountElement.textContent = data.count;
        })
        .catch(error => console.error('Error fetching visitor count:', error));
    }

    countvisitor()

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
            
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

    

});


// Function to scroll to the top of the page
function goToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  }
  
  // Show/hide the button based on scroll position
  window.onscroll = function() {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("goToTopBtn").style.display = "block";
    } else {
      document.getElementById("goToTopBtn").style.display = "none";
    }
  }
  
  function year() {
    // alert("Calling Year Function");
    var year = $('#year').val();
    // alert("Selected Year is::--" + year);
    
    const jsonObj = [
        { "value": "ae", "text": "Aerospace Engineering" },
        { "value": "ag", "text": "Agricultural Engineering" },
        { "value": "ar", "text": "Architecture and Planning" },
        { "value": "ce", "text": "Civil Engineering" },
        { "value": "ch", "text": "Chemical Engineering" },
        { "value": "cs", "text": "Computer Science and Information Technology" },
        { "value": "cy", "text": "Chemistry" },
        { "value": "ec", "text": "Electronics and Communication Engineering" },
        { "value": "ee", "text": "Electrical Engineering" },
        { "value": "gg", "text": "Geology and Geophysics" },
        { "value": "in", "text": "Instrumentation Engineering" },
        { "value": "ma", "text": "Mathematics" },
        { "value": "me", "text": "Mechanical Engineering" },
        { "value": "mn", "text": "Mining Engineering" },
        { "value": "mt", "text": "Metallurgical Engineering" },
        { "value": "ph", "text": "Physics" },
        { "value": "pi", "text": "Production and Industrial Engineering" },
        { "value": "tf", "text": "Textile Engineering and Fibre Science" },
        { "value": "xe", "text": "Engineering Sciences" },
        { "value": "xl", "text": "Life Sciences" }
    ];

    function populated() {
        // Assuming jsonObj is an array of objects with "value" and "text" properties
        $.each(jsonObj, function (index, option) {
            $('#sub_code').append('<option value="' + option.value + '_' + year + '.pdf' + '">' + option.text + '</option>');
        });

        $('#subjectDivId').removeClass('hidden');
    }
    // }, "json").fail(function () {
    //     alert("server error");
    // });
    populated();
}

function subject() {
    // alert("Calling Subject Function");
    var year = $('#year').val();
    var sub_code = $('#sub_code').val();
    $('#downloadLinkId').removeClass('hidden');
    $("#download-link").attr("href", "https://gate.iitkgp.ac.in/documents/gatepapers/" + year + "/" + sub_code);
    // alert("Selected Year is::--"+year);
    // alert("Selected sub_code is::--"+sub_code);
}