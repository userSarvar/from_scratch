// hrpage.js

function fetchDataForDate(startDate, endDate) {
    fetch(`/get-promoter-data?start_date=${startDate}&end_date=${endDate}`)
      .then(response => response.json())
      .then(data => {
        // Update table content with filtered data
      });
  
    fetch(`/get-sv-data?start_date=${startDate}&end_date=${endDate}`)
      .then(response => response.json())
      .then(data => {
        // Update table content with filtered data
      });
  }
  
  const dateFilter = document.getElementById('dateFilter');
  dateFilter.addEventListener('change', function () {
    const selectedDate = dateFilter.value;
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 1);
    fetchDataForDate(selectedDate, endDate.toISOString().slice(0, 10));
  });