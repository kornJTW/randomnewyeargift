let names = [];

// Add a name to the list
function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        nameInput.value = '';
        updateNameList(); // Update the displayed list
    } else {
        alert('Please enter a valid name.');
    }
}

// Update the displayed name list
function updateNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = ''; // Clear the current list
    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        nameList.appendChild(li);
    });
}

// Start the draw animation with a spinning wheel
function startDrawAnimation() {
    if (names.length === 0) {
        alert('No names available to draw.');
        return;
    }

    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let startAngle = 0;
    const arcSize = (2 * Math.PI) / names.length;
    const spinTime = 3000; // Spin for 3 seconds
    const spinIncrement = Math.random() * 5 + 5; // Randomize the final spin

    // Draw the wheel
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        names.forEach((name, index) => {
            const angle = startAngle + index * arcSize;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arcSize, false);
            ctx.fillStyle = index % 2 === 0 ? '#FFD700' : '#FF4500';
            ctx.fill();
            ctx.stroke();
            ctx.save();

            // Add text
            ctx.translate(
                centerX + Math.cos(angle + arcSize / 2) * radius * 0.6,
                centerY + Math.sin(angle + arcSize / 2) * radius * 0.6
            );
            ctx.rotate(angle + arcSize / 2);
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.fillText(name, -ctx.measureText(name).width / 2, 5);
            ctx.restore();
        });
    }

    // Animate the spin
    let spinAngle = 0;
    const spinInterval = setInterval(() => {
        spinAngle += spinIncrement;
        startAngle += (Math.PI / 180) * spinAngle;
        drawWheel();
    }, 30);

    // Stop spinning and pick a name
    setTimeout(() => {
        clearInterval(spinInterval);
        const selectedIndex = Math.floor(
            ((startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / arcSize
        );
        const selectedName = names[selectedIndex];
        names.splice(selectedIndex, 1); // Remove the chosen name
        updateNameList(); // Update the displayed list
        drawWheel(); // Redraw the wheel with remaining names
        document.getElementById('result').textContent = `The chosen one is: ${selectedName}!`;
    }, spinTime);
}
