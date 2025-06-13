import './style.css'; // Importa o CSS para o Vite processar
import emailjs from '@emailjs/browser'; // Importa o EmailJS do node_modules
import profileImage from './img/fotoPerfil.JPEG'; // Importa a imagem

// Carrega a imagem de perfil dinamicamente
document.querySelector('.avatar').src = profileImage;

// Animação de fade-in para as seções ao rolar a página
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

    // Função para envio do formulário com EmailJS
    function sendEmail(e) {
        e.preventDefault();
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let parms = {
            title: document.getElementById("subject").value,
            name: document.getElementById("name").value,
            time: time,
            message: document.getElementById("message").value,
            email: document.getElementById("email").value
        };
        
        // Usa as variáveis carregadas do .env
        emailjs.send(serviceID, templateID, parms)
            .then(function() {
                alert("Mensagem enviada com sucesso!");
                document.getElementById("contactForm").reset();
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