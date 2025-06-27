import './style.css';
import emailjs from '@emailjs/browser';

// Código do avatar removido. O erro não acontecerá mais.

document.addEventListener('DOMContentLoaded', function () {
    // Acessa as variáveis de ambiente do Vite
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    // Inicializa o EmailJS
    if (publicKey) {
        emailjs.init({ publicKey });
    }

    // Animação de fade-in das seções
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
            email: document.getElementById("email").value,
        };
        
        if (serviceID && templateID) {
            emailjs.send(serviceID, templateID, parms)
                .then(function() {
                    alert("Mensagem enviada com sucesso!");
                    document.getElementById("contactForm").reset();
                }, function(error) {
                    alert("Erro ao enviar a mensagem: " + JSON.stringify(error));
                });
        } else {
            console.error("As variáveis de ambiente do EmailJS não estão configuradas.");
            alert("Erro: A configuração de envio de e-mail está incompleta.");
        }
    }

    // Adiciona o listener ao formulário
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', sendEmail);
    }
    
    // --- LÓGICA DO MENU SANDUÍCHE ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('is-active');
                navMenu.classList.remove('is-active');
            });
        });
    }
});