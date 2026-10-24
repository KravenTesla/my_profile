const translations = {
  es: {
    skip:"Saltar al contenido", navAbout:"Acerca de mí", navResearch:"Investigación", navTeaching:"Docencia", navProjects:"Proyectos", navPublications:"Publicaciones", navContact:"Contacto",
    heroEyebrow:"Perfil académico y tecnológico", heroTitle:"Docencia, investigación y tecnología con propósito.", heroLead:"Soy José Manuel Muñoz Contreras. En este espacio reúno mi trabajo académico, recursos de enseñanza, proyectos tecnológicos e intereses de investigación.", exploreResearch:"Explorar investigación", getInTouch:"Contactar", heroMeta:"Tijuana, Baja California, México", visualNote:"Aprender · Construir · Compartir",
    pillar1Title:"Investigación", pillar1Text:"Exploración de problemas, métodos computacionales y conocimiento reproducible.", pillar2Title:"Docencia", pillar2Text:"Materiales, prácticas y experiencias para acercar la teoría a la práctica.", pillar3Title:"Desarrollo tecnológico", pillar3Text:"Herramientas, software y experimentos para resolver problemas concretos.", learnMore:"Conocer más",
    aboutEyebrow:"Una breve introducción", aboutTitle:"Acerca de mí", aboutLead:"Me interesa conectar el conocimiento académico con la práctica: investigar, enseñar y construir soluciones tecnológicas que puedan compartirse y mejorarse.", connect:"Conectar y colaborar", profileRole:"Académico · Tecnología · Investigación · Desarrollo de software", locationLabel:"Ubicación", locationValue:"Baja California", institutionLabel:"Institución", institutionValue:"Universidad Autónoma de Baja California (FCITEC)", emailLabel:"Correo",
    researchEyebrow:"Preguntas, métodos e ideas", researchTitle:"Investigación", research1Title:"Programación genética y cómputo evolutivo", research1Link:"Explorar el laboratorio de GP", research1Text:"Diseño y evaluación de algoritmos de programación genética semántica geométrica (GSGP) para regresión simbólica y modelado de datos complejos.", research2Title:"Regresión simbólica aplicada", research2Text:"Métodos de regresión simbólica para problemas reales, desde estimación de composición corporal hasta modelado multidimensional.", research3Title:"Cómputo paralelo en GPU", research3Text:"Frameworks de software que aceleran algoritmos evolutivos mediante CUDA, como GSGP-CUDA, liberado como herramienta de código abierto.", researchFootnote:"Cada línea está respaldada por publicaciones verificables — consulta los detalles en la sección de Publicaciones.",
    teachingEyebrow:"Compartir conocimiento", teachingTitle:"Docencia y recursos", featuredResource:"Recurso destacado", teachingFeatureTitle:"Materiales para el aprendizaje práctico", viewResources:"Consultar recursos", course1Title:"Sistemas operativos y Linux", course1Text:"Guías, comandos esenciales y prácticas de administración.", course2Title:"Redes y servicios", course2Text:"Prácticas de conectividad, SSH y servicios de red.", course3Title:"Programación", course3Text:"Ejercicios, proyectos y material de apoyo.",
    projectsEyebrow:"De la idea al prototipo", projectsTitle:"Proyectos seleccionados", projectCategory1:"Proyectos personales", project1Title:"Homelab y servicios autohospedados", project1Text:"Diseño, despliegue y mantenimiento de servicios autohospedados para experimentar y aprender de forma continua.", projectCategory2:"Investigación", project2Title:"Visualización de métodos de aprendizaje", project2Text:"Proyecto en desarrollo para visualizar y analizar el comportamiento de algoritmos de aprendizaje automático y cómputo evolutivo.", projectCategory3:"Herramientas educativas", project3Title:"Clases", project3Text:"Página dedicada, construida en NotebookLM, que reunirá el contenido completo de mis clases, prácticas y recursos didácticos.", projectDetails:"Ver detalles",
    publicationsEyebrow:"Producción académica", publicationsTitle:"Publicaciones", pubTypeArticle:"ARTÍCULO DE INVESTIGACIÓN", pubTypeConference:"CONFERENCIA / CONGRESO", pubTypeOther:"OTRO TRABAJO ACADÉMICO", pubTypeChapter:"CAPÍTULO DE LIBRO", pubTypePreprint:"PREPRINT",
    contactEyebrow:"Contacto y colaboración", contactTitle:"¿Conversamos sobre una idea?", contactText:"Estoy interesado en intercambiar ideas, compartir recursos y explorar colaboraciones académicas y tecnológicas.", contactEmailLabel:"Correo profesional", footerText:"Docencia · Investigación · Tecnología", backTop:"Volver arriba", footerDisclaimer:"Sitio personal · Contenido sujeto a actualización"
  },
  en: {
    skip:"Skip to content", navAbout:"About", navResearch:"Research", navTeaching:"Teaching", navProjects:"Projects", navPublications:"Publications", navContact:"Contact",
    heroEyebrow:"Academic and technology profile", heroTitle:"Teaching, research, and technology with purpose.", heroLead:"I’m José Manuel Muñoz Contreras. This space brings together my academic work, teaching resources, technology projects, and research interests.", exploreResearch:"Explore research", getInTouch:"Get in touch", heroMeta:"Tijuana, Baja California, Mexico", visualNote:"Learn · Build · Share",
    pillar1Title:"Research", pillar1Text:"Exploring problems, computational methods, and reproducible knowledge.", pillar2Title:"Teaching", pillar2Text:"Materials, practical exercises, and experiences that connect theory with practice.", pillar3Title:"Technology development", pillar3Text:"Tools, software, and experiments designed to solve real problems.", learnMore:"Learn more",
    aboutEyebrow:"A brief introduction", aboutTitle:"About me", aboutLead:"I’m interested in connecting academic knowledge with practice: researching, teaching, and building technology solutions that can be shared and improved.", connect:"Connect and collaborate", profileRole:"Academia · Technology · Research · Software Development", locationLabel:"Location", locationValue:"Baja California", institutionLabel:"Institution", institutionValue:"Autonomous University of Baja California (FCITEC)", emailLabel:"Email",
    researchEyebrow:"Questions, methods, and ideas", researchTitle:"Research", research1Title:"Genetic programming and evolutionary computing", research1Link:"Explore the GP lab", research1Text:"Design and evaluation of geometric semantic genetic programming (GSGP) algorithms for symbolic regression and complex data modeling.", research2Title:"Applied symbolic regression", research2Text:"Symbolic regression methods for real-world problems, from body-composition estimation to multidimensional modeling.", research3Title:"GPU parallel computing", research3Text:"Software frameworks that accelerate evolutionary algorithms with CUDA, such as GSGP-CUDA, released as an open-source tool.", researchFootnote:"Every line is backed by verifiable publications — see the Publications section for details.",
    teachingEyebrow:"Sharing knowledge", teachingTitle:"Teaching and resources", featuredResource:"Featured resource", teachingFeatureTitle:"Hands-on learning materials", viewResources:"Browse resources", course1Title:"Operating systems and Linux", course1Text:"Guides, essential commands, and administration labs.", course2Title:"Networks and services", course2Text:"Connectivity, SSH, and network service exercises.", course3Title:"Programming", course3Text:"Exercises, projects, and supporting materials.",
    projectsEyebrow:"From idea to prototype", projectsTitle:"Selected projects", projectCategory1:"Personal projects", project1Title:"Homelab and self-hosted services", project1Text:"Designing, deploying, and maintaining self-hosted services for continuous experimentation and learning.", projectCategory2:"Research", project2Title:"Learning Methods Visualization", project2Text:"Project in progress to visualize and analyze the behavior of machine learning and evolutionary computing algorithms.", projectCategory3:"Educational tools", project3Title:"Classes", project3Text:"A dedicated page, built on NotebookLM, that will bring together the full content of my classes, hands-on practices, and teaching resources.", projectDetails:"View details",
    publicationsEyebrow:"Academic output", publicationsTitle:"Publications", pubTypeArticle:"RESEARCH ARTICLE", pubTypeConference:"CONFERENCE PAPER", pubTypeOther:"OTHER ACADEMIC WORK", pubTypeChapter:"BOOK CHAPTER", pubTypePreprint:"PREPRINT",
    contactEyebrow:"Contact and collaboration", contactTitle:"Shall we discuss an idea?", contactText:"I’m interested in exchanging ideas, sharing resources, and exploring academic and technology collaborations.", contactEmailLabel:"Professional email", footerText:"Teaching · Research · Technology", backTop:"Back to top", footerDisclaimer:"Personal website · Content subject to updates"
  }
};

let currentLanguage = "es";
const languageButton = document.getElementById("language-toggle");
function setLanguage(language) {
  currentLanguage = language;
  try { localStorage.setItem("lang", language); } catch (e) {}
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[language][key]) element.textContent = translations[language][key];
  });
  languageButton.textContent = language === "es" ? "EN" : "ES";
  languageButton.setAttribute("aria-label", language === "es" ? "Switch to English" : "Cambiar a español");
  document.title = language === "es"
    ? "José Manuel Muñoz Contreras | Académico e ingeniero"
    : "José Manuel Muñoz Contreras | Academic and engineer";
}
try { if (localStorage.getItem("lang") === "en") setLanguage("en"); } catch (e) {}
languageButton.addEventListener("click", () => setLanguage(currentLanguage === "es" ? "en" : "es"));

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? (currentLanguage === "es" ? "Cerrar menú" : "Close menu") : (currentLanguage === "es" ? "Abrir menú" : "Open menu"));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("current-year").textContent = new Date().getFullYear();
