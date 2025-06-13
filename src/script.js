import './style.css';
import emailjs from '@emailjs/browser';
import profileImage from './img/fotoPerfil.JPEG';

// Carrega a imagem de perfil dinamicamente
document.querySelector('.avatar').src = profileImage;

document.addEventListener('DOMContentLoaded', function () {
    // Acessa as variáveis de ambiente do Vite
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    // Inicializa o EmailJS
    emailjs.init({ publicKey });

    const sections = document.querySelectorAll('main section');
    const revealSection = () => {
        const triggerBottom = window.innerHeight * 0.85;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealSection);
    revealSection();

    // Função para envio do formulário com EmailJS e reCAPTCHA
    function sendEmail(e) {
        e.preventDefault();

        // --- ALTERAÇÕES AQUI ---

        // 1. Pega a resposta do reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();

        // 2. Verifica se o reCAPTCHA foi preenchido
        if (recaptchaResponse.length === 0) {
            alert("Por favor, complete o reCAPTCHA.");
            return; // Para a execução se não foi preenchido
        }
        
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let parms = {
            title: document.getElementById("subject").value,
            name: document.getElementById("name").value,
            time: time,
            message: document.getElementById("message").value,
            email: document.getElementById("email").value,
            // 3. Adiciona a resposta do reCAPTCHA ao objeto de parâmetros
            'g-recaptcha-response': recaptchaResponse
        };

        // --- FIM DAS ALTERAÇÕES ---

        // Usa as variáveis carregadas do .env
        emailjs.send(serviceID, templateID, parms)
            .then(function() {
                alert("Mensagem enviada com sucesso!");
                document.getElementById("contactForm").reset();
                grecaptcha.reset(); // Reseta o reCAPTCHA também
            }, function(error) {
                alert("Erro ao enviar a mensagem: " + JSON.stringify(error));
            });
    }

    // Adiciona o listener ao formulário
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', sendEmail);
    }
});