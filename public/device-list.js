const setEditModal = (hid) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `http://localhost:8080/device/${hid}`, false);
    xhttp.send();

    const book = JSON.parse(xhttp.responseText);

    const {
        device,
        status,
        publisher, 
        publish_date,
        value
    } = book;

    document.getElementById('hid').value = hid;
    document.getElementById('device').value = device;
    document.getElementById('status').value = status;
    document.getElementById('publisher').value = publisher;
    document.getElementById('publish_date').value = publish_date;
    document.getElementById('value').value = value;

    // setting up the action url for the device
    document.getElementById('editForm').action = `http://localhost:8080/device/${isbn}`;
}

const deleteBook = (hid) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", `http://localhost:8080/device/${hid}`, false);
    xhttp.send();

    location.reload();
}

const loadBooks = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:8080/device", false);
    xhttp.send();

    const books = JSON.parse(xhttp.responseText);

    for (let book of books) {
        const x = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${book.device}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${book.hid}</h6>

                        <div>Status: ${book.status}</div>
                        <div>Publisher: ${book.publisher}</div>
                        <div>Value: ${book.value}</div>
                        <div>Date: ${book.publish_date}</div>

                        <hr>

                        <button type="button" class="btn btn-danger">Delete</button>
                        <button types="button" class="btn btn-primary" data-toggle="modal" 
                            data-target="#editBookModal" onClick="setEditModal(${book.hid})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `

        document.getElementById('books').innerHTML = document.getElementById('books').innerHTML + x;
    }
}

loadBooks();