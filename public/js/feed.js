var form = document.getElementById('sheetdb-form');
form.addEventListener("submit", e => {
    e.preventDefault();
    fetch(form.action, {
        method: "POST",
        body: new FormData(document.getElementById("sheetdb-form")),
    })
        .then(res => res.json())
        .then(data => {
            if (data.status == 'ok') {
                alert("something went wrong");
            } else {
                alert('Your Feedback has been submitted successfully, Thank You!');
            }
        });
});