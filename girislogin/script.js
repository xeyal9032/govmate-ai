// --- API YAPISI (İleride gerçek bir backend ile değiştirmek için buraları düzenleyin) ---
const API_BASE_URL = "https://sizin-api-adresiniz.com/api"; // Gerçek projede kendi API adresinizi yazın

// API İsteklerini Yöneten Servis
const AuthService = {
    // Kayıt Olma İsteği
    async register(name, email, password) {
        console.log("Kayıt isteği gönderiliyor...", { name, email, password });
        
        // GERÇEK BİR API'YE BAĞLANMAK İÇİN AŞAĞIDAKİ YORUM SATIRLARINI AÇIN:
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            if (!response.ok) throw new Error("Kayıt başarısız oldu");
            return await response.json();
        } catch (error) {
            throw error;
        }
        */

        // ŞİMDİLİK SİMÜLASYON (API yokken test etmek için)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Başarılı bir senaryo simüle ediliyor
                resolve({ success: true, message: "Kayıt işlemi başarılı", data: { name, email } });
                // Hata simüle etmek isterseniz: reject(new Error("E-posta zaten kullanımda"));
            }, 1000); // 1 saniye gecikme
        });
    },

    // Giriş Yapma İsteği
    async login(email, password) {
        console.log("Giriş isteği gönderiliyor...", { email, password });
        
        // GERÇEK BİR API'YE BAĞLANMAK İÇİN AŞAĞIDAKİ YORUM SATIRLARINI AÇIN:
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error("Giriş başarısız, e-posta veya şifre hatalı");
            return await response.json(); // Genellikle token döner { token: "abc...", user: {...} }
        } catch (error) {
            throw error;
        }
        */

        // ŞİMDİLİK SİMÜLASYON
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ success: true, token: "fake-jwt-token-12345", message: "Giriş başarılı" });
            }, 1000);
        });
    },

    // Şifremi Unuttum İsteği
    async resetPassword(email) {
        // Gerçek API kodunuz buraya gelecek...
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    }
};

// --- ARAYÜZ (UI) ETKİLEŞİMLERİ ---
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Panel değiştirme fonksiyonları
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Kayıt Ol Formu
const signUpForm = document.querySelector('.sign-up-container form');
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const submitBtn = signUpForm.querySelector('button');
    const nameInput = signUpForm.querySelector('input[type="text"]').value;
    const emailInput = signUpForm.querySelector('input[type="email"]').value;
    const passwordInput = signUpForm.querySelector('input[type="password"]').value;
    
    if(!nameInput || !emailInput || !passwordInput) {
        return alert("Lütfen tüm alanları doldurun.");
    }

    try {
        // Yükleniyor durumu göster
        submitBtn.innerText = "KAYDEDİLİYOR...";
        submitBtn.disabled = true;

        // API'yi çağır
        const response = await AuthService.register(nameInput, emailInput, passwordInput);
        
        if (response.success) {
            // Yönlendirme yapıyoruz
            signUpForm.reset();
            container.classList.remove("right-panel-active");
            window.location.href = `dashboard.html?user=${encodeURIComponent(nameInput)}`;
        }
    } catch (error) {
        alert("Kayıt sırasında bir hata oluştu: " + error.message);
    } finally {
        // Butonu eski haline getir
        submitBtn.innerText = "KAYIT OL";
        submitBtn.disabled = false;
    }
});

// Giriş Yap Formu
const signInForm = document.querySelector('.sign-in-container form');
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const submitBtn = signInForm.querySelector('button.sign-in-btn');
    const emailInput = signInForm.querySelector('input[type="email"]').value;
    const passwordInput = signInForm.querySelector('input[type="password"]').value;
    
    if(!emailInput || !passwordInput) {
        return alert("Lütfen e-posta ve şifrenizi girin.");
    }

    try {
        submitBtn.innerText = "GİRİŞ YAPILIYOR...";
        submitBtn.disabled = true;

        // API'yi çağır
        const response = await AuthService.login(emailInput, passwordInput);
        
        if (response.success) {
            signInForm.reset();
            const userNameFromEmail = emailInput.split('@')[0];
            window.location.href = `dashboard.html?user=${encodeURIComponent(userNameFromEmail)}`;
        }
    } catch (error) {
        alert("Giriş başarısız: " + error.message);
    } finally {
        submitBtn.innerText = "SIGN IN";
        submitBtn.disabled = false;
    }
});

// Şifremi Unuttum İşlemi
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailInput = signInForm.querySelector('input[type="email"]').value;
    
    if(!emailInput) {
        return alert("Lütfen önce e-posta adresinizi girin, ardından 'Şifremi Unuttum'a tıklayın.");
    }

    try {
        const response = await AuthService.resetPassword(emailInput);
        if (response.success) {
            alert(`Şifre sıfırlama bağlantısı ${emailInput} adresine gönderildi.`);
        }
    } catch (error) {
        console.error(error);
    }
});
