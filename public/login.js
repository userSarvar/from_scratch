document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let role;
    // Example login logic (this should be replaced with actual authentication)
    if (username === 'ceopage' && password === 'ceoPassword2200') {
        role = 'retailCoordinator';
    } else if (username === 'hrpage' && password === 'hrPassword2200') {
        role = 'hr';
    } else if (username === 'rm' && password === 'password') {
        role = 'regionalManager';
    } else if (username === 'retailpage' && password === 'retailPassword2200') {
        role = 'retailAnalytics';
    } else if (username === 'sv' && password === 'svPassword2200') {
        role = 'supervisor';
    } else if (username === 'promoter' && password === 'promoterPassword2200') {
        role = 'promoter';
    
    
    } else {
        alert('Invalid username or password');
        return;
    }
    
    localStorage.setItem('role', role);
    window.location.href = 'home.html';
});



