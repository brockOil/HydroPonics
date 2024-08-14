// script.js
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('liveGraph').getContext('2d');
    const liveGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'EC Level (mS/cm)',
                    borderColor: '#ff6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    data: [],
                    fill: true,
                },
                {
                    label: 'pH Level',
                    borderColor: '#36a2eb',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    data: [],
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#fff',
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Level',
                        color: '#fff',
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });

    // Initialize data arrays from local storage or empty arrays
    const ecData = JSON.parse(localStorage.getItem('ecData')) || [];
    const phData = JSON.parse(localStorage.getItem('phData')) || [];

    // Populate graph with initial data
    ecData.forEach((data) => {
        liveGraph.data.labels.push(data.time);
        liveGraph.data.datasets[0].data.push(data.level);
    });
    phData.forEach((data, i) => {
        liveGraph.data.datasets[1].data.push(data.level);
    });
    liveGraph.update();

    function updateData() {
        const ecLevel = (Math.random() * 0.2 + 1.3).toFixed(2); // Example: EC level around 1.4 mS/cm
        const phLevel = (Math.random() * 0.4 + 6.8).toFixed(2); // Example: pH level around 7
        const currentTime = new Date().toLocaleTimeString();

        document.getElementById('ec-level').textContent = `${ecLevel} mS/cm`;
        document.getElementById('ph-level').textContent = phLevel;

        liveGraph.data.labels.push(currentTime);
        liveGraph.data.datasets[0].data.push(ecLevel);
        liveGraph.data.datasets[1].data.push(phLevel);

        ecData.push({ time: currentTime, level: ecLevel });
        phData.push({ time: currentTime, level: phLevel });

        liveGraph.update();

        // Limit the number of data points displayed
        if (liveGraph.data.labels.length > 20) {
            liveGraph.data.labels.shift();
            liveGraph.data.datasets[0].data.shift();
            liveGraph.data.datasets[1].data.shift();
            ecData.shift();
            phData.shift();
        }

        // Update local storage
        localStorage.setItem('ecData', JSON.stringify(ecData));
        localStorage.setItem('phData', JSON.stringify(phData));
    }

    function downloadCSV() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Time,EC Level (mS/cm),pH Level\n"
            + ecData.map((e, i) => `${e.time},${e.level},${phData[i].level}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `hydroponics_data_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);

    setInterval(updateData, 1000);
});
