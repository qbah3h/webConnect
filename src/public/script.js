// document.getElementById('htmlForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     var url = document.getElementById('urlInput').value;
//     fetch(url)
//     .then(response => response.text())
//     .then(html => {
//         // Display HTML content
//         document.getElementById('htmlDisplay').innerHTML = html;
//     })
//     .catch(error => {
//         console.error('Error fetching HTML:', error);
//     });
// });

// document.getElementById('htmlForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     var url = document.getElementById('urlInput').value;
//     fetch(url)
//     .then(response => response.text())
//     .then(html => {
//         // Display HTML content
//         document.getElementById('htmlDisplay').innerHTML = html;
//     })
//     .catch(error => {
//         console.error('Error fetching HTML:', error);
//     });
// });
document.getElementById('htmlForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    var url = document.getElementById('urlInput').value;
    fetch("/loadWebsite", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(html => {
        // Display HTML content
        document.getElementById('htmlDisplay').innerHTML = html;

        // Display source code
        document.getElementById('sourceCodeDisplay').textContent = html;
    })
    .catch(error => {
        console.error('Error fetching HTML:', error);
    });
});

