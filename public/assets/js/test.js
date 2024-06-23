document.addEventListener('DOMContentLoaded', function () {
  // Bar Chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
              label: 'Orders',
              data: [65, 59, 80, 81, 56, 55, 40, 85, 90, 120, 70, 50],
              backgroundColor: 'rgba(0, 162, 255, 0.6)',
          }]
      },
  });

  // Doughnut Chart
  const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
  const doughnutChart = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
          labels: ['Oct', 'Nov', 'Dec'],
          datasets: [{
              data: [300, 50, 100],
              backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
          }]
      },
  });
});

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

    async function fetchUserCount() {
      try {
        const response = await fetch('/api/user-count');
        const data = await response.json();
        document.getElementById('user-count').textContent = `${data.userCount} Users`;
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    }

    // Fetch user count on page load
    document.addEventListener('DOMContentLoaded', fetchUserCount);


