/*==============================
=   Portafolio - JavaScript
=   File: script.js
==============================*/



/*======================================
=   DELETE SCROLLX AND
=   CLOSE MENU ACTION
======================================*/

const checkbox = document.querySelector('#open-menu');
const mediaQuery = window.matchMedia('(max-width: 768px)');

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("#header-nav-list a");

    if (!checkbox.checked) {
        document.body.classList.remove("open-menu", "no-scroll");
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            document.body.classList.add("open-menu", "no-scroll");
        } else {
            document.body.classList.remove("open-menu", "no-scroll");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            checkbox.checked = false;
            document.body.classList.remove("open-menu", "no-scroll");
        });
    });

    mediaQuery.addEventListener("change", (e) => {
        if (!e.matches) {
            checkbox.checked = false;
            document.body.classList.remove("open-menu", "no-scroll");
        }
    });
});





/*======================================
=   PROJECTS
======================================*/

// Card positioning
function applyCardLayout() {
    const cards = document.querySelectorAll(".project__card");
    cards.forEach((card, index) => {
        const layoutNumber = (index % 8) + 1;
        card.classList.add(`layout-${layoutNumber}`);
    });
}


// Image animation on cards
function applyCardImageAnimation(card) {
    const image = card.querySelector('.project__thumbnail');
    if (!image) return;
    let animationFrame;

    card.addEventListener('mousemove', e => {
        if (animationFrame) cancelAnimationFrame(animationFrame);

        animationFrame = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;

            image.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
            image.style.transition = 'transform .4s ease-out';
        });
    });

    card.addEventListener('mouseleave', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        image.style.transform = 'translate(0, 0)';
        image.style.transition = 'transform 0.6s ease';
    });
}


// Add projects dynamically and persist them in local storage
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');

    function createTechList(techs) {
        const techIcons = {
            html: 'assets/icons/html5.png',
            css: 'assets/icons/css3.png',
            javascript: 'assets/icons/js.png',
            python: 'assets/icons/python.png',
            react: 'assets/icons/react.png',
            tailwind: 'assets/icons/tailwind.png'
        };

        const ul = document.createElement('ul');
        ul.className = 'project__technologies';
        ul.setAttribute('aria-label', 'Technologies used in the project');
        techs.forEach(tech => {
            const li = document.createElement('li');
            const key = tech.toLowerCase();
            if (techIcons[key]) {
                const img = document.createElement('img');
                img.src = techIcons[key];
                img.alt = tech;
                img.title = tech;
                img.className = 'tech-icon';
                img.width = 24;
                img.height = 24;
                li.appendChild(img);
            } else {
                li.textContent = tech;
            }
            ul.appendChild(li);
        });
        return ul;
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project__card';
        card.setAttribute('role', 'article');

        // Main image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'project__container--image';
        const img = document.createElement('img');
        img.className = 'project__thumbnail';
        img.src = project.projectThumbnail || '';
        img.alt = `Preview of ${project.projectName || ''}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgContainer.appendChild(img);

        // Description and data
        const desc = document.createElement('div');
        desc.className = 'project__description';

        const h4 = document.createElement('h4');
        h4.className = 'project__name';
        h4.textContent = project.projectName || '';

        const spanType = document.createElement('span');
        spanType.className = 'project__type--site';
        spanType.textContent = project.projectTypeSite || '';

        const p = document.createElement('p');
        p.className = 'project__synopsis';
        p.textContent = project.synopsis || '';

        // Technologies
        const techList = createTechList(project.technologies || []);

        // SVG from GitHub
        const githubSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        githubSvg.classList.add('project__github');
        githubSvg.setAttribute('width', '40');
        githubSvg.setAttribute('height', '40');
        githubSvg.setAttribute('viewBox', '0 0 20 20');
        githubSvg.setAttribute('aria-label', 'Go to the GitHub repository');
        githubSvg.style.cursor = 'pointer';

        const githubPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        githubPath.setAttribute('d', 'M10 0.5C4.75 0.5 0.5 4.75 0.5 10c0 4.2 2.7 7.75 6.45 9 .47.09.65-.2.65-.45v-1.6c-2.62.57-3.17-1.26-3.17-1.26-.43-1.1-1.05-1.39-1.05-1.39-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.23 1.03 2.78.79.09-.62.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.68 0-1.03.37-1.87.98-2.53-.1-.24-.43-1.21.09-2.53 0 0 .81-.26 2.65 1 .77-.21 1.6-.32 2.43-.32s1.66.11 2.43.32c1.84-1.26 2.65-1 2.65-1 .52 1.32.19 2.29.09 2.53.61.66.98 1.5.98 2.53 0 3.64-2.2 4.44-4.29 4.68.34.29.64.86.64 1.73v2.56c0 .25.18.54.65.45C16.8 17.75 19.5 14.2 19.5 10c0-5.25-4.25-9.5-9.5-9.5z');
        githubPath.setAttribute('fill', '#000');
        githubSvg.appendChild(githubPath);

        if (project.githubURL) {
            githubSvg.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(project.githubURL, '_blank');
            });
        }

        // Container technologies and GitHub
        const techGithubContainer = document.createElement('div');
        techGithubContainer.className = 'project__container--tech-github';
        techGithubContainer.appendChild(techList);
        techGithubContainer.appendChild(githubSvg);

        // Arrow SVG
        const arrow = document.createElement('span');
        arrow.className = 'project__arrow';
        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrowSvg.setAttribute('fill', 'none');
        arrowSvg.setAttribute('stroke', 'currentColor');
        arrowSvg.setAttribute('stroke-width', '2');
        const arrowPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath1.setAttribute('d', 'M7 7L17 7L17 17');
        arrowPath1.setAttribute('stroke-linecap', 'round');
        arrowPath1.setAttribute('stroke-linejoin', 'round');
        const arrowPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath2.setAttribute('d', 'M7 17L17 7');
        arrowPath2.setAttribute('stroke-linecap', 'round');
        arrowPath2.setAttribute('stroke-linejoin', 'round');
        arrowSvg.appendChild(arrowPath1);
        arrowSvg.appendChild(arrowPath2);
        arrow.appendChild(arrowSvg);
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (project.projectURL) {
                window.open(project.projectURL, '_blank');
            }
        });

        desc.appendChild(h4);
        desc.appendChild(spanType);
        desc.appendChild(p);
        desc.appendChild(techGithubContainer);

        // Click on the card to open the project's main page.
        card.addEventListener('click', () => {
            if (project.projectURL) {
                window.open(project.projectURL, '_blank');
            }
        });

        card.appendChild(imgContainer);
        card.appendChild(desc);
        card.appendChild(arrow);

        return card;
    }

    function renderProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            const card = createProjectCard(project);
            projectsContainer.appendChild(card);
            applyCardImageAnimation(card);
        });
        applyCardLayout();
    }

    function loadProjects() {
        fetch('projects.json')
            .then(res => res.json())
            .then(jsonProjects => {
                renderProjects(jsonProjects);
                localStorage.setItem('portfolioProjects', JSON.stringify(jsonProjects));
            })
            .catch(err => {
                console.error('Error loading projects:', err);
                projectsContainer.textContent = 'Projects could not be loaded.';
            });
    }

    loadProjects();
});


// Avoid default jump
function focusNameInput(event) {
    event.preventDefault();
    const nameInput = document.getElementById('contactname');
    if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInput.focus();
    }
}

/*======================================
=   CONTACT FORM
======================================*/

(function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const contactInputs = contactForm.querySelectorAll('.contact__form--field');
    const submitBtn = contactForm.querySelector('.contact__form--btn');
    const status = document.getElementById('form-status');

    function validateInput(input) {
        const isValid = input.checkValidity();
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
        input.setAttribute('aria-invalid', !isValid);
    }

    contactInputs.forEach(input => {
        const small = input.parentElement.querySelector('small');
        if (!small) return;
        small.style.display = 'none'; // Oculta por defecto

        input.addEventListener('focus', () => {
            small.style.display = 'block';
        });
        input.addEventListener('blur', () => {
            small.style.display = 'none';
        });
    });

    contactInputs.forEach(input => {
        ['input', 'change', 'blur'].forEach(eventType => {
            input.addEventListener(eventType, () => validateInput(input));
        });
    });

    window.addEventListener('load', () => {
        contactInputs.forEach(input => {
            setTimeout(() => validateInput(input), 100);
        });
    });

    contactForm.addEventListener('input', () => {
        submitBtn.disabled = !contactForm.checkValidity();
    });

    // Send contact form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            status.textContent = "Please complete all fields correctly.";
            submitBtn.disabled = true;
            return;
        }

        submitBtn.disabled = true;
        status.textContent = '';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://formspree.io/f/xanjjkeg', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                status.textContent = "Message sent successfully!";
                contactForm.reset();
                contactInputs.forEach(el => {
                    el.classList.remove('valid', 'invalid');
                    el.removeAttribute('aria-invalid');
                });
                submitBtn.disabled = true;
            } else {
                status.textContent = "Error sending message. Please try again later.";
                submitBtn.disabled = false;
            }
        } catch (error) {
            status.textContent = "An unexpected error occurred.";
            submitBtn.disabled = false;
        }
    });
})();