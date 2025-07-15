/*---------- MENU ----------*/

// Delete scrollX and close menu action.
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







/*---------- PROYECTOS ----------*/

// --- Add Project Button ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.ADMIN_KEY && localStorage.getItem('soyAdmin') === window.ADMIN_KEY) {
        document.getElementById('container-add-project').style.display = 'flex';
    }
});

// --- Mostrar Formulario ---
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-project-btn');
    const form = document.getElementById('form-add-project');
    if (addBtn && form) {
        form.style.display = 'none';
        addBtn.addEventListener('click', () => {
            if (form.style.display === 'flex') {
                form.style.display = 'none';
            } else {
                form.style.display = 'flex';
                const firstInput = form.querySelector('input, textarea, select');
                if (firstInput) firstInput.focus();
            }
        });
    }
});


// Card positioning.
function applyCardLayout() {
    const cards = document.querySelectorAll(".project__card");
    cards.forEach((card, index) => {
        const layoutNumber = (index % 8) + 1;
        card.classList.add(`layout-${layoutNumber}`);
    });
}


// Animación de imagen en tarjetas
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

            image.style.transform = `scale(1.2) translate(${x * 10}px, ${y * 10}px)`;
            image.style.transition = 'transform 0.1s ease-out';
        });
    });

    card.addEventListener('mouseleave', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        image.style.transform = 'translate(0, 0)';
        image.style.transition = 'transform 0.6s ease';
    });
}

// Side panel effects.
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("project-wrapper-details");
    const panel = document.getElementById("project-details-panel");
    const closeButton = document.getElementById("close-panel");
    const darkBackground = document.getElementById("dark-background");

    const closePanel = () => {
        panel.classList.remove("active");
        document.body.classList.remove("panel-open");

        panel.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'transform') {
                wrapper.classList.remove("active");
                panel.removeEventListener('transitionend', handler);
            }
        });

        if (panel._trapFocusHandler) {
            panel.removeEventListener('keydown', panel._trapFocusHandler);
            panel._trapFocusHandler = null;
        }

        const firstViewLink = document.querySelector(".view__project");
        firstViewLink?.focus() || document.body.focus();
    };

    document.addEventListener("click", (e) => {
        const link = e.target.closest(".view__project");
        if (link) {
            e.preventDefault();
            const idx = link.getAttribute('data-index');
            showProjectPanelByIndex(Number(idx));
            wrapper.classList.add("active");
            panel.classList.add("active");
            document.body.classList.add("panel-open");

            const focusableElements = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            firstFocusable?.focus();

            function trapFocus(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
                if (e.key === 'Escape') {
                    closePanel();
                }
            }

            panel.addEventListener('keydown', trapFocus);
            panel._trapFocusHandler = trapFocus;
        }
    });

    closeButton.addEventListener("click", closePanel);
    darkBackground.addEventListener("click", closePanel);

    panel.addEventListener("click", e => e.stopPropagation());
});





// --- Agregar proyectos dinamicamente y persistir en localStorage ---
document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('form-add-project');
    const projectsContainer = document.getElementById('projects-container');
    const panelContent = document.querySelector('#project-details-panel .panel__content');

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve('');
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function createTechList(techs, className = '') {
        const ul = document.createElement('ul');
        if (className) ul.className = className;
        techs.forEach(tech => {
            const li = document.createElement('li');
            if (className === 'list__skills--used') li.className = 'skills__used';
            li.textContent = tech;
            ul.appendChild(li);
        });
        return ul;
    }

    function createProjectCard(project, index) {
        const { projectName, synopsis, projectThumbnail } = project;
        const card = document.createElement('div');
        card.className = 'project__card';
        card.setAttribute('role', 'article');
        card.setAttribute('data-index', index);

        const imgContainer = document.createElement('div');
        imgContainer.className = 'project__container--image';
        const img = document.createElement('img');
        img.className = 'project__thumbnail';
        img.src = projectThumbnail || '';
        img.alt = `Preview of ${projectName || ''}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        imgContainer.appendChild(img);

        const desc = document.createElement('div');
        desc.className = 'project__description';

        const h4 = document.createElement('h4');
        h4.className = 'project__name';
        h4.textContent = projectName || '';

        const p = document.createElement('p');
        p.className = 'project__synopsis';
        p.textContent = synopsis || '';

        desc.appendChild(h4);
        desc.appendChild(p);

        // Flecha en la esquina superior derecha (SVG creado por nodos)
        const arrow = document.createElement('span');
        arrow.className = 'project__arrow';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');

        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M7 7L17 7L17 17');
        path1.setAttribute('stroke-linecap', 'round');
        path1.setAttribute('stroke-linejoin', 'round');

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M7 17L17 7');
        path2.setAttribute('stroke-linecap', 'round');
        path2.setAttribute('stroke-linejoin', 'round');

        svg.appendChild(path1);
        svg.appendChild(path2);
        arrow.appendChild(svg);

        card.appendChild(imgContainer);
        card.appendChild(desc);
        card.appendChild(arrow);

        // Toda la tarjeta abre el panel lateral
        card.addEventListener('click', () => {
            window.showProjectPanelByIndex(index);
            document.getElementById('project-wrapper-details').classList.add('active');
            document.getElementById('project-details-panel').classList.add('active');
            document.body.classList.add('panel-open');
        });

        applyCardImageAnimation(card);

        return card;
    }


    function showProjectPanelByIndex(index) {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const project = projects[index];
        if (!project) return;

        while (panelContent.firstChild) panelContent.removeChild(panelContent.firstChild);

        const intro = document.createElement('div');
        intro.className = 'panel__introduction';

        const h3 = document.createElement('h3');
        h3.className = 'panel__name';
        h3.textContent = project.projectName || '';

        // Crea el contenedor para sinopsis y tipo de página
        const synTypeContainer = document.createElement('div');
        synTypeContainer.className = 'container__syn--type';

        const pIntro = document.createElement('p');
        pIntro.className = 'panel__synopsis';
        pIntro.textContent = project.synopsis || '';

        const spanType = document.createElement('span');
        spanType.className = 'panel__type--site';
        spanType.textContent = project.projectTypeSite || '';

        // Añade los elementos al contenedor
        synTypeContainer.appendChild(pIntro);
        synTypeContainer.appendChild(spanType);

        // Añade el nombre y el contenedor al intro
        intro.appendChild(h3);
        intro.appendChild(synTypeContainer);

        const imgGeneral = document.createElement('img');
        imgGeneral.className = 'panel__general--image';
        imgGeneral.src = project.projectGeneralImage || '';
        imgGeneral.alt = `Full preview of ${project.projectName || ''}`;
        imgGeneral.loading = 'lazy';
        imgGeneral.decoding = 'async';

        const about = document.createElement('div');
        about.className = 'panel__about--project';
        const h4About = document.createElement('h4');
        h4About.textContent = 'About the project';
        const pDesc = document.createElement('div');
        pDesc.className = 'panel__description';
        // Convierte saltos de línea dobles o simples en párrafos
        pDesc.innerHTML = (project.description || '')
            .split(/\n+/)
            .filter(line => line.trim() !== '')
            .map(line => `<p>${line.trim()}</p>`)
            .join('');
        about.appendChild(h4About);
        about.appendChild(pDesc);

        const techDiv = document.createElement('div');
        techDiv.className = 'panel__technologies';
        techDiv.appendChild(createTechList(project.technologies, 'list__skills--used'));

        const linksDiv = document.createElement('div');
        linksDiv.className = 'panel__links';
        if (project.projectURL) {
            const liveA = document.createElement('a');
            liveA.className = 'panel__live--url';
            liveA.href = project.projectURL;
            liveA.target = '_blank';
            liveA.rel = 'noopener noreferrer';
            liveA.setAttribute('aria-label', 'Visit live website of project');
            liveA.textContent = 'View site';
            linksDiv.appendChild(liveA);
        }
        if (project.githubURL) {
            const codeA = document.createElement('a');
            codeA.className = 'panel__github--repository';
            codeA.href = project.githubURL;
            codeA.target = '_blank';
            codeA.rel = 'noopener noreferrer';
            codeA.setAttribute('aria-label', 'View project code on GitHub');
            codeA.textContent = 'View Code';
            linksDiv.appendChild(codeA);
        }

        panelContent.appendChild(intro);
        panelContent.appendChild(imgGeneral);
        panelContent.appendChild(about);
        panelContent.appendChild(techDiv);
        panelContent.appendChild(linksDiv);
    }
    window.showProjectPanelByIndex = showProjectPanelByIndex;

    // --- Botón para descargar projects.json actualizado ---
    const downloadBtn = document.getElementById('download-projects');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
            const jsonString = JSON.stringify(projects, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'projects.json';
            a.click();

            URL.revokeObjectURL(url);
        });
    }


    function loadProjects() {
        const localProjects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');

        fetch('projects.json')
            .then(res => res.json())
            .then(jsonProjects => {
                const merged = [...localProjects];

                jsonProjects.forEach(jsonProj => {
                    const exists = localProjects.some(lp => lp.projectName === jsonProj.projectName);
                    if (!exists) merged.push(jsonProj);
                });

                saveProjects(merged);
                renderProjects(merged);
            })
            .catch(err => {
                if (localProjects.length) {
                    renderProjects(localProjects);
                } else {
                    console.error('Error al cargar los proyectos:', err);
                    projectsContainer.innerHTML = '<p style="color:red;">No se pudieron cargar los proyectos.</p>';
                }
            });
    }

    function renderProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach((project, idx) => {
            const card = createProjectCard(project, idx);
            projectsContainer.appendChild(card);
        });
        applyCardLayout();
    }

    function saveProjects(projects) {
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    }

    if (projectForm) {
        projectForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const projectName = projectForm.projectName.value.trim();
            const projectTypeSite = projectForm.projectTypeSite.options[projectForm.projectTypeSite.selectedIndex].text;
            const synopsis = projectForm.synopsis.value.trim();
            const description = projectForm.description.value.trim();
            const technologies = projectForm.technologies.value.split(',').map(t => t.trim()).filter(Boolean);
            const projectThumbnail = projectForm.projectThumbnail.value.trim();
            const projectGeneralImage = projectForm.projectGeneralImage.value.trim();
            const projectURL = projectForm.projectURL.value.trim();
            const githubURL = projectForm.githubURL.value.trim();

            // Depuración
            console.log("Campos:", { projectName, projectTypeSite, synopsis, description, technologies, projectThumbnail, projectGeneralImage, projectURL, githubURL });

            const project = {
                projectName,
                projectTypeSite,
                synopsis,
                description,
                technologies,
                projectThumbnail,
                projectGeneralImage,
                projectURL,
                githubURL
            };

            const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
            projects.push(project);
            saveProjects(projects);
            loadProjects();

            // Depuración
            console.log("Guardado en localStorage:", localStorage.getItem('portfolioProjects'));

            projectForm.reset();
            projectForm.style.display = 'none';
        });
    }

    loadProjects();
});


// ---
function focusNameInput(event) {
    event.preventDefault(); // Evita el salto por defecto
    const nameInput = document.getElementById('contactname');
    if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInput.focus();
    }
}



// --- CONTACT FORM ---
(function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const contactInputs = contactForm.querySelectorAll('.contact__form--field');
    const submitBtn = contactForm.querySelector('.contact__form--btn');
    const status = document.getElementById('form-status');

    // Función para validar un input o textarea y marcar clase + aria-invalid
    function validateInput(input) {
        const isValid = input.checkValidity();
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
        input.setAttribute('aria-invalid', !isValid);
    }

    // Mostrar/ocultar el <small> solo cuando el input tiene foco
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

    // Validar inputs SOLO del formulario de contacto usando la clase
    contactInputs.forEach(input => {
        ['input', 'change', 'blur'].forEach(eventType => {
            input.addEventListener(eventType, () => validateInput(input));
        });
    });

    // Validar después de cargar para autocomplete SOLO en contacto
    window.addEventListener('load', () => {
        contactInputs.forEach(input => {
            setTimeout(() => validateInput(input), 100);
        });
    });

    // Deshabilitar/enviar botón dependiendo de la validez del formulario de contacto
    contactForm.addEventListener('input', () => {
        submitBtn.disabled = !contactForm.checkValidity();
    });

    // Enviar formulario de contacto
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            status.textContent = "Por favor, completa todos los campos correctamente.";
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
                status.textContent = "¡Mensaje enviado correctamente!";
                contactForm.reset();
                contactInputs.forEach(el => {
                    el.classList.remove('valid', 'invalid');
                    el.removeAttribute('aria-invalid');
                });
                submitBtn.disabled = true;
            } else {
                status.textContent = "Error al enviar el mensaje. Intenta más tarde.";
                submitBtn.disabled = false;
            }
        } catch (error) {
            status.textContent = "Ocurrió un error inesperado.";
            submitBtn.disabled = false;
        }
    });
})();