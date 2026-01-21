function renderCourtMap(containerId, occupiedSeats, onSelect) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const rows = 10; // Example: 10 rows
  const seatsPerRow = 20; // Example: 20 seats per row

  for (let row = 1; row <= rows; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    for (let seat = 1; seat <= seatsPerRow; seat++) {
      const seatId = `R${row}S${seat}`;
      const seatDiv = document.createElement('div');
      seatDiv.className = 'seat';
      seatDiv.textContent = seatId;

      if (occupiedSeats.includes(seatId)) {
        seatDiv.classList.add('occupied');
      } else {
        seatDiv.addEventListener('click', () => onSelect(seatId));
      }

      rowDiv.appendChild(seatDiv);
    }

    container.appendChild(rowDiv);
  }
}