/**
 * Datos del portafolio
 * Aquí se centralizan todos los datos que se muestran en la aplicación
 * Facilita el mantenimiento y la actualización del contenido
 */

// Información personal básica
export const personalInfo = {
    name: 'Amle Martinez Marte',
    title: 'Desarrollador Full Stack',
    photo: '/images/Amle.png', 
    email: 'tu@email.com',
    location: 'Tu Ciudad, País',
    summary: {
        es: 'Soy un desarrollador apasionado por crear soluciones web modernas y eficientes. Me especializo en tecnologías como JavaScript, Java,  Python y frameworks modernos como spring boot, React, Vue y Svelte.',
        en: 'I am a developer passionate about creating modern and efficient web solutions. I specialize in technologies like JavaScript, Java, Python and modern frameworks like Spring boot, React, Vue and Svelte.'
    }
};

// Tecnologías que manejas con niveles descriptivos
export const technologies = [
     
    { name: 'JavaScript', logo: '/icons/javascript.svg', level: 'Experto' },  
    { name: 'TypeScript', logo: '/icons/typescript.svg', level: 'Avanzado' },    
    { name: 'Svelte/SvelteKit', logo: '/icons/svelte.svg', level: 'Avanzado' },  
    { name: 'React', logo: '/icons/react.svg', level: 'Avanzado' },          
    { name: 'Node.js', logo: '/icons/nodejs.svg', level: 'Intermedio' },    
    { name: 'Python', logo: '/icons/python.svg', level: 'Intermedio' }        
];

// Experiencia laboral (se ordenará cronológicamente en el Timeline)
export const workExperience = [
    {
        id: 1,
        company: 'Empresa ABC',
        positionKey: 'work.1.position',
        descriptionKey: 'work.1.description',
        startYear: '2022',
        endYear: null, // Null siginifica presente
        technologies: ['JavaScript', 'React', 'Node.js']
    },
    {
        id: 2,
        company: 'Startup XYZ',
        positionKey: 'work.2.position',
        descriptionKey: 'work.2.description',
        startYear: '2020',
        endYear: '2022',
        technologies: ['Vue.js', 'Python', 'PostgreSQL']
    },
    {
        id: 3,
        company: 'Freelance',
        positionKey: 'work.3.position',
        descriptionKey: 'work.3.description',
        startYear: '2018',
        endYear: '2020',
        technologies: ['HTML', 'CSS', 'JavaScript', 'PHP']
    }
];

// Educación académica
export const education = [
    {
        id: 1,
        institution: 'Universidad ABC',
        degreeKey: 'education.1.degree',
        descriptionKey: 'education.1.description',
        startYear: '2016',
        endYear: '2020'
    },
    {
        id: 2,
        institution: 'Instituto Técnico XYZ',
        degreeKey: 'education.2.degree',
        descriptionKey: 'education.2.description',
        startYear: '2014',
        endYear: '2016'
    }
];

// Proyectos destacados
export const projects = [
    {
        id: 1,
        nameKey: 'projects.p1.name',  
        descriptionKey: 'projects.p1.description',  
     
        images: ['/projects/project1-image.svg'],  
        technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Stripe'],
        liveUrl: 'https://ejemplo.com',
        githubUrl: 'https://github.com/usuario/proyecto',
        date: '2024-01-15'
    },
    {
        id: 2,
        nameKey: 'projects.p2.name',  
        descriptionKey: 'projects.p2.description',   
        images: ['/projects/project2-image.svg'],  
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        githubUrl: 'https://github.com/usuario/proyecto2',
        date: '2023-11-20'
    }
];

// Habilidades organizadas por categorías
export const skills = {
    // Habilidades técnicas con niveles descriptivos
    technical: [
        { nameKey: 'skills.technical.frontend', level: 'Experto' },
        { nameKey: 'skills.technical.backend', level: 'Avanzado' },
        { nameKey: 'skills.technical.database', level: 'Intermedio' },
        { nameKey: 'skills.technical.devops', level: 'Básico' },
        { nameKey: 'skills.technical.mobile', level: 'Intermedio' },
        { nameKey: 'skills.technical.uiux', level: 'Intermedio' }
    ],

    // Idiomas que hablas
    languages: [
        { nameKey: 'skills.languages.spanish', level: 'Nativo' },
        { nameKey: 'skills.languages.english', level: 'Avanzado' },
        { nameKey: 'skills.languages.french', level: 'Básico' }
    ],

    // Habilidades blandas
    soft: [
        'skills.soft.teamwork',
        'skills.soft.communication',
        'skills.soft.problemSolving',
        'skills.soft.adaptability',
        'skills.soft.leadership'
    ],
    // Hobbies e intereses
    hobbies: [
        'skills.hobbies.personalProjects',
        'skills.hobbies.techReading',
        'skills.hobbies.gaming',
        'skills.hobbies.photography'
    ],

    // Certificaciones importantes
    certificates: [
        {
            nameKey: 'certificates.aws.name',
            issuerKey: 'certificates.aws.issuer',
            date: '2023'
        },
        {
            nameKey: 'certificates.gcp.name',
            issuerKey: 'certificates.gcp.issuer',
            date: '2022'
        }
    ]
};