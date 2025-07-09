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
	email: 'amlemartinezmarte@gmail.com',
	location: 'Alcalá de Henares, España',
	github: 'https://github.com/misterlink19',
	linkedin: 'https://www.linkedin.com/in/amle-martinez-marte-15a433208/',
	summary: {
		es: 'Desarrollador Backend Junior con base sólida en Java y Python. Actualmente curso un Máster en Desarrollo Ágil de Software en la Universidad de Alcalá, con proyectos aplicando Spring Boot, CI/CD y microservicios. Experiencia previa en soporte técnico con foco en automatización de tareas y mejora de procesos. Orientado al aprendizaje continuo y al trabajo en equipo',
		en: 'Junior Backend Developer with a solid foundation in Java and Python. Currently pursuing a Master in Agile Software Development at the University of Alcalá, with projects applying Spring Boot, CI/CD and microservices. Previous experience in technical support with focus on task automation and process improvement. Oriented to continuous learning and teamwork.'
	},
	cv: 'home.CV'
};

// Tecnologías que manejas con niveles descriptivos (no son mensajes traducibles directamente, se mantienen como strings)
export const technologies = [
	{ name: 'Java', logo: '/icons/java.svg', level: 'skills.advanced' },
	{ name: 'HTML', logo: '/icons/html.svg', level: 'skills.expert' },
	{ name: 'CSS', logo: '/icons/css.svg', level: 'skills.expert' },
	{ name: 'JavaScript', logo: '/icons/javascript.svg', level: 'skills.expert' },
	{ name: 'TypeScript', logo: '/icons/typescript.svg', level: 'skills.advanced' },
	{ name: 'Svelte/SvelteKit', logo: '/icons/svelte.svg', level: 'skills.intermediate' },
	{ name: 'React', logo: '/icons/react.svg', level: 'skills.intermediate' },
	{ name: 'Vue', logo: '/icons/vue.svg', level: 'skills.intermediate' },
	{ name: 'Azure', logo: '/icons/azure.svg', level: 'skills.intermediate' },
	{ name: 'Python', logo: '/icons/python.svg', level: 'skills.advanced' },
	{ name: 'C++', logo: '/icons/Cplusplus.svg', level: 'skills.intermediate' },
	{ name: 'Git', logo: '/icons/git.svg', level: 'skills.intermediate' },
	{ name: 'Spring boot', logo: '/icons/springboot.svg', level: 'skills.intermediate' },
	{ name: 'Ionic', logo: '/icons/ionic.svg', level: 'skills.intermediate' },
	{ name: 'MySQL', logo: '/icons/mysql.svg', level: 'skills.advanced' }
];

// Experiencia laboral (se ordenará cronológicamente en el Timeline)
export const workExperience = [
	{
		id: 1,
		company: 'Ruamar, SRL “Agencia de Préstamos”',
		positionKey: 'work.1.position',
		descriptionKey: 'work.1.description',
		startYear: '2022',
		endYear: '2024', // Null significa presente
		technologies: ['SQL Server', 'bash', 'office', 'scripts', 'Hunter GPS', 'Anydesk']
	},
	{
		id: 2,
		company: 'Centro Médico Siglo 21',
		positionKey: 'work.2.position',
		descriptionKey: 'work.2.description',
		startYear: '2022',
		endYear: '2022',
		technologies: [
			'SQL Server',
			'office',
			'scripts',
			'nmap',
			'OSI Model',
			'Networking',
			'Anydesk',
			'Teamviewer'
		]
	}
];

// Educación académica
export const education = [
	{
		id: 1,
		institution: 'Universidad de Alcalá',
		degreeKey: 'education.1.degree',
		descriptionKey: 'education.1.description',
		startYear: '2024',
		endYear: '2025'
	},
	{
		id: 2,
		institution: 'Universidad Autónoma de Santo Domingo',
		degreeKey: 'education.2.degree',
		descriptionKey: 'education.2.description',
		startYear: '2015',
		endYear: '2022'
	}
];

// Proyectos destacados
export const projects = [
	{
		id: 'viaje-confort-react',
		nameKey: 'projects.p1.name',
		descriptionKey: 'projects.p1.description',
		images: [
			'/projects/p1-1.png',
			'/projects/p1-2.png',
			'/projects/p1-3.png',
			'/projects/p1-4.png'
		],
		technologies: ['React', 'JavaScript ', 'HTML5', 'CSS3', 'Bootstrap'],
		liveUrl: null,
		githubUrl: 'https://github.com/misterlink19/Proyecto-Viajes-Confort-React',
		date: '2025-05-24'
	},
	{
		id: 'Portal-F1',
		nameKey: 'projects.p2.name',
		descriptionKey: 'projects.p2.description',
		images: [
			'/projects/p2-1.png',
			'/projects/p2-2.png',
			'/projects/p2-3.png' // Una sola imagen para este proyecto
		],
		technologies: [
			'Spring Boot (versión 3.3.4)',
			'Base de Datos SQL (MySQL)',
			'Hibernate JPA',
			'Lombok',
			'Thymeleaf',
			'Mockito',
			'FullCalendar',
			'reCAPTCHA de Google'
		],
		liveUrl: null, // Puedes dejarlo null si no hay demo en vivo
		githubUrl: 'https://github.com/misterlink19/Portal-Formula-1', // Cambia a tu URL real
		date: '2025-04-20'
	},
	{
		id: 'portal-peliculas-5mc',
		nameKey: 'projects.p3.name',
		descriptionKey: 'projects.p3.description',
		images: ['/projects/p3-1.png', '/projects/p3-2.png', '/projects/p3-3.png'],
		technologies: [
			'Spring Boot',
			'JPA (Hibernate)',
			'MySQL',
			'Thymeleaf',
			'Eureka Server',
			'Spring Cloud Gateway',
			'Spring Security'
		],
		liveUrl: null,
		githubUrl: 'https://github.com/misterlink19/Proyecto-Portal-Peliculas-5-Microservicios',
		date: '2024-04-16'
	},
	{
		id: 'portal-peliculas-desplegada',
		nameKey: 'projects.p4.name',
		descriptionKey: 'projects.p4.description',
		images: ['/projects/p4-1.png'],
		technologies: [
			'Spring Boot',
			'RestTemplate',
			'Thymeleaf',
			'Microsoft Azure',
			'GitHub Actions',
			'SonarQube',
			'JUnit'
		],
		liveUrl: 'https://moviecards-martinez.azurewebsites.net/',
		githubUrl: 'https://github.com/misterlink19/Proyecto-Portal-Peliculas-5-Microservicios',
		date: '2025-02-15'
	}
	// Añade más proyectos aquí siguiendo la misma estructura
];

// Habilidades organizadas por categorías
export const skills = {
	// Habilidades técnicas con niveles descriptivos
	technical: [
		{ nameKey: 'skills.technical.web', level: 'Experto' },
		{ nameKey: 'skills.technical.frontend', level: 'Avanzado' },
		{ nameKey: 'skills.technical.backend', level: 'Avanzado' },
		{ nameKey: 'skills.technical.database', level: 'Avanzado' },
		{ nameKey: 'skills.technical.scrum', level: 'Avanzado' },
		{ nameKey: 'skills.technical.network', level: 'Avanzado' },
		{ nameKey: 'skills.technical.devops', level: 'Intermedio' },
		{ nameKey: 'skills.technical.mobile', level: 'Intermedio' },
		{ nameKey: 'skills.technical.uiux', level: 'Intermedio' },
		{ nameKey: 'skills.technical.security', level: 'Intermedio' },
		{ nameKey: 'skills.technical.container', level: 'Intermedio' }
	],

	// Idiomas que hablas
	languages: [
		{ nameKey: 'skills.languages.spanish', level: 'Nativo' },
		{ nameKey: 'skills.languages.english', level: 'Avanzado' }
	],

	// Habilidades blandas (solo las claves, no un objeto { nameKey: ... })
	soft: [
		'skills.soft.teamwork',
		'skills.soft.problemSolving',
		'skills.soft.adaptability',
		'skills.soft.proactivity',
		'skills.soft.organization',
		'skills.soft.continuousLearning',
		'skills.soft.communication',
		'skills.soft.resilience',
		'skills.soft.selfAwareness'
	],
	// Hobbies e intereses
	hobbies: [
		'skills.hobbies.readingBooks',
		'skills.hobbies.readingComicsManga',
		'skills.hobbies.playingPiano',
		'skills.hobbies.listeningMedia',
		'skills.hobbies.watchingMedia',
		'skills.hobbies.gaming'
	],

	// Certificaciones importantes
	certificates: [
		{
			nameKey: 'certificates.fds.name',
			issuerKey: 'certificates.fds.issuer',
			date: '2023'
		},
		{
			nameKey: 'certificates.acis.name',
			issuerKey: 'certificates.acis.issuer',
			date: '2022'
		},
		{
			nameKey: 'certificates.itla.name',
			issuerKey: 'certificates.itla.issuer',
			date: '2021'
		},
		{
			nameKey: 'certificates.oea.name',
			issuerKey: 'certificates.oea.issuer',
			date: '2021'
		},
		{
			nameKey: 'certificates.mescyt.name',
			issuerKey: 'certificates.mescyt.issuer',
			date: '2020'
		},
		{
			nameKey: 'certificates.eoi.name',
			issuerKey: 'certificates.eoi.issuer',
			date: '2019'
		},
		{
			nameKey: 'certificates.mescyt2.name',
			issuerKey: 'certificates.mescyt2.issuer',
			date: '2017'
		}
	]
};
