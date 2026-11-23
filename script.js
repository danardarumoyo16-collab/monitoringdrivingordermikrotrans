setInterval(() => {
    const clockElem = document.getElementById('sysClock');
    if (clockElem) {
        const now = new Date();
        clockElem.innerText = now.toTimeString().split(' ')[0] + ' WIB';
    }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const ctxTrip = document.getElementById('tripChart');
    if (ctxTrip) {
        new Chart(ctxTrip.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jak-Pusat', 'Jak-Utara', 'Jak-Barat', 'Jak-Selatan', 'Jak-Timur'],
                datasets: [
                    {
                        label: 'Target Trip',
                        data: [40, 45, 35, 50, 60],
                        backgroundColor: 'rgba(51, 65, 85, 0.5)',
                        borderRadius: 6
                    },
                    {
                        label: 'Realisasi Live Trip',
                        data: [38, 42, 34, 48, 55],
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
                scales: {
                    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' } }
                }
            }
        });
    }

    const ctxStatus = document.getElementById('statusChart');
    if (ctxStatus) {
        new Chart(ctxStatus.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Aktif Berjalan', 'Selesai DO', 'Pending/Standby'],
                datasets: [{
                    data: [42, 98, 16],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } } }
            }
        });
    }
});

function filterTable() {
    const query = document.getElementById('tableSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function exportData() {
    alert("Mengeksport ringkasan data ke format Excel...");
}

function viewDetail(kodeBus) {
    alert("Detail Driving Order untuk Bus: " + kodeBus);
}