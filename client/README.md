<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Stream</title>
</head>
<body>
    <h1>Log Stream</h1>
    <pre id="logs"></pre>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        const logsElement = document.getElementById('logs');
        let lastLogSize = 0;

        // Function to fetch logs
        function fetchLogs() {
            axios.get('http://localhost:2000/api/logs', {
                headers: {
                    'Range': `bytes=${lastLogSize}-`
                },
                responseType: 'text'
            })
            .then(response => {
                if (response.data) {
                    logsElement.innerText += response.data;
                    lastLogSize += response.data.length;
                }
            })
            .catch(error => {
                console.error('Error fetching logs:', error);
            });
        }

        // Poll the server every 5 seconds
        setInterval(fetchLogs, 5000);

        // Initial log fetch
        fetchLogs();
    </script>
</body>
</html>
