// Synchronous XMLHttpRequest
function loadSync() {
    let request = new XMLHttpRequest();

    // Load reference synchronously
    request.open('GET', 'data/reference.json', false); // Synchronous request
    request.send();

    if (request.status === 200) {
        let refData = JSON.parse(request.responseText);

        // Load data1 synchronously using the reference
        request.open('GET', `data/${refData.data_location}`, false);
        request.send();

        if (request.status === 200) {
            let data1 = JSON.parse(request.responseText);

            processAndLoadData(data1.data);

            request.open('GET', `data/${data1.data_location}`, false);
            request.send();

            if (request.status === 200) {
                let data2 = JSON.parse(request.responseText);
                processAndLoadData(data2.data);
                
                request.open('GET', 'data/data3.json', false);
                request.send();

                if (request.status === 200) {
                    let data3 = JSON.parse(request.responseText);
                    processAndLoadData(data3.data);
                }
            }
        }
    }
}

// Asynchronous XMLHttpRequest with Callbacks
function loadAsync() {
    let request = new XMLHttpRequest();

    request.open('GET', 'data/reference.json', true); // Asynchronous request
    request.onload = function () {
        if (request.status === 200) {
            let refData = JSON.parse(request.responseText);

            // Load data1 asynchronously using the reference
            let data1Request = new XMLHttpRequest();
            data1Request.open('GET', `data/${refData.data_location}`, true);
            data1Request.onload = function () {
                if (data1Request.status === 200) {
                    let data1 = JSON.parse(data1Request.responseText);
                    processAndLoadData(data1.data);

                    let data2Request = new XMLHttpRequest();
                    data2Request.open('GET', `data/${data1.data_location}`, true);
                    data2Request.onload = function () {
                        if (data2Request.status === 200) {
                            let data2 = JSON.parse(data2Request.responseText);
                            processAndLoadData(data2.data);

                            let data3Request = new XMLHttpRequest();
                            data3Request.open('GET', 'data/data3.json', true);
                            data3Request.onload = function () {
                                if (data3Request.status === 200) {
                                    let data3 = JSON.parse(data3Request.responseText);
                                    processAndLoadData(data3.data);
                                }
                            };
                            data3Request.send();
                        }
                    };
                    data2Request.send();
                }
            };
            data1Request.send();
        }
    };
    request.send();
}

// Fetch API with Promises
function loadFetch() {
    fetch('data/reference.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch reference.json: ' + response.status);
            }
            return response.json();
        })
        .then(refData => fetch(`data/${refData.data_location}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data1.json: ' + response.status);
            }
            return response.json();
        })
        .then(data1 => {
            console.log('Successfully loaded data1.json');
            processAndLoadData(data1.data);
            return fetch(`data/${data1.data_location}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data2.json: ' + response.status);
            }
            return response.json();
        })
        .then(data2 => {
            console.log('Successfully loaded data2.json');
            processAndLoadData(data2.data);
            return fetch('data/data3.json');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data3.json: ' + response.status);
            }
            return response.json();
        })
        .then(data3 => {
            console.log('Successfully loaded data3.json');
            processAndLoadData(data3.data);
        })
        .catch(error => console.error('Error:', error));
}

// Helper function to process and load data into the table
function processAndLoadData(data) {
    let tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = ''; // Clear the table before loading new data

    data.forEach(item => {
        let nameParts = item.name.split(' ');
        let row = document.createElement('tr');
        row.innerHTML = `<td>${nameParts[0]}</td><td>${nameParts[1]}</td><td>${item.id}</td>`;
        tableBody.appendChild(row);
    });
}
