document.addEventListener('DOMContentLoaded', () => {
    
    // 1. УНИВЕРСАЛЬНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ПАРОЛЯ
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const container = this.closest('.password-group');
            if (!container) return;

            const input = container.querySelector('input');
            const openImg = this.querySelector('.eye-open');
            const closedImg = this.querySelector('.eye-closed');

            if (input && openImg && closedImg) {
                const isPassword = input.type === 'password';
                
                // Меняем тип поля
                input.type = isPassword ? 'text' : 'password';
                
                // Переключаем видимость иконок
                if (isPassword) {
                    openImg.classList.add('hidden');
                    closedImg.classList.remove('hidden');
                } else {
                    openImg.classList.remove('hidden');
                    closedImg.classList.add('hidden');
                }
            }
        });
    });

    // 2. ОБРАБОТКА ФОРМЫ РЕГИСТРАЦИИ (signupForm)
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            console.log('Данные регистрации:', { name, email, password });
            alert('Аккаунт успешно создан!');
        });
    }

    // 3. ОБРАБОТКА ФОРМЫ ВХОДА (loginForm)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const emailPhone = document.getElementById('emailPhone').value;
            const password = document.getElementById('password').value;

            if (!emailPhone || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            console.log('Попытка входа:', { emailPhone });
            alert('Вы успешно вошли!');
        });
    }

    // 4. ОБРАБОТКА ССЫЛКИ "ЗАБЫЛИ ПАРОЛЬ"
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Функция восстановления пароля в разработке');
        });
    }

    // 5. УЛУЧШЕНИЕ UX
    const allInputs = document.querySelectorAll('.form-group input');
    allInputs.forEach(input => {
        // Проверка при загрузке (если браузер подставил данные)
        if (input.value !== '') {
            input.classList.add('has-value');
        }
        // Проверка при вводе
        input.addEventListener('blur', () => {
            if (input.value !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
});