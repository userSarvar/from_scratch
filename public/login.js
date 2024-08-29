document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('role', data.role);
            window.location.href = 'home.html';
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in');
    }
});
