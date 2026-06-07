export type TerminalProfile = {
	historyKey: string;
	dirs: Record<string, string[]>;
	files: Record<string, string>;
	internalRoutes: Record<string, string>;
	helpExamples: string[];
	hint: string;
	introLines: (date: string) => string[];
};

export const homeTerminalProfile: TerminalProfile = {
	historyKey: 'runrioter-terminal-history-v1',
	dirs: {
		'/': ['ai', 'css', 'aws', 'about', 'topics', 'README.md', 'PRINCIPLES.md'],
		'/topics': ['ai', 'css', 'aws', 'about'],
		'/ai': ['intro', 'system-instructions', 'agent-behavior', 'output-formatting'],
		'/css': ['bfc', 'contain', 'flex', 'position'],
		'/aws': ['cloudformation'],
		'/about': ['profile.md']
	},
	files: {
		'/README.md': [
			'Runrioter Blog',
			'',
			'- Topics: CSS / AWS / AI',
			'- Style: terminal-inspired, practical, source-driven',
			"- Try 'help' for available commands"
		].join('\n'),
		'/PRINCIPLES.md': [
			'1. Explain why before how.',
			'2. Prefer reusable minimal templates.',
			'3. Keep engineering trade-offs explicit.'
		].join('\n'),
		'/about.md': 'About page summary. Use: open about',
		'/ai/intro': 'AI intro: prompt engineering foundations and practical templates.',
		'/css/intro': 'CSS intro: BFC, contain, positioning, and predictable layout behavior.',
		'/aws/intro': 'AWS intro: deployable and rollback-friendly infrastructure notes.'
	},
	internalRoutes: {
		ai: '/ai',
		css: '/css',
		aws: '/aws',
		about: '/about',
		'/ai': '/ai',
		'/css': '/css',
		'/aws': '/aws',
		'/about': '/about'
	},
	helpExamples: [
		'whoami',
		'cat README.md',
		'ls -la topics/',
		'cat PRINCIPLES.md',
		'cat ai/intro',
		'cd css',
		'open github'
	],
	hint: 'Try: help, whoami, cat README.md, ls -la topics/, cat PRINCIPLES.md, cat ai/intro, cd css, open github',
	introLines: (date) => [
		'Runrioter Interactive Terminal v1.0',
		`Date: ${date}`,
		'Type help to list available commands.'
	]
};

export const aboutTerminalProfile: TerminalProfile = {
	historyKey: 'runrioter-terminal-history-v1-about',
	dirs: {
		'/': ['profile.txt', 'focus.txt', 'writing-style.txt', 'links.txt', 'README.md'],
		'/topics': ['ai', 'css', 'aws']
	},
	files: {
		'/README.md': [
			'Runrioter Blog - About Terminal',
			'',
			"- Run 'whoami' for identity",
			"- Run 'cat profile.txt' for key info",
			"- Run 'open github' for full profile"
		].join('\n'),
		'/profile.txt': [
			'Name: Runrioter',
			'Identity: Human-made, AI-free',
			'Role: Developer, writer, builder'
		].join('\n'),
		'/focus.txt': 'CSS / AWS / AI prompt engineering',
		'/writing-style.txt': [
			'- Practical templates over vague concepts',
			'- Explicit engineering trade-offs',
			'- Short path from idea to implementation'
		].join('\n'),
		'/links.txt': ['GitHub: https://github.com/Runrioter'].join('\n')
	},
	internalRoutes: {
		home: '/',
		ai: '/ai',
		css: '/css',
		aws: '/aws',
		about: '/about',
		'/': '/',
		'/ai': '/ai',
		'/css': '/css',
		'/aws': '/aws',
		'/about': '/about'
	},
	helpExamples: [
		'whoami',
		'cat profile.txt',
		'cat focus.txt',
		'cat writing-style.txt',
		'open github'
	],
	hint: 'Try: whoami, cat profile.txt, cat focus.txt, cat writing-style.txt, open github',
	introLines: (date) => [
		'Runrioter Developer Terminal v1.0',
		`Date: ${date}`,
		'',
		'Developer quick profile:',
		'  Name: Runrioter',
		'  Identity: Human-made, AI-free',
		'  Focus: CSS / AWS / AI prompt engineering',
		'',
		'Want more details? Execute: open github',
		'Type help to list available commands.'
	]
};

export const aiTerminalProfile: TerminalProfile = {
	historyKey: 'rr:ai:history',
	dirs: {
		'/': ['basics', 'system-instructions', 'agent-design', 'formatting', 'README.md'],
		'/topics': ['ai', 'css', 'aws', 'about']
	},
	files: {
		'/README.md': [
			'AI Prompt Engineering Tutorials',
			'',
			"- Run 'ls' to inspect modules",
			"- Run 'open basics' to start from fundamentals",
			"- Run 'open system-instructions' to learn policy-level prompt design"
		].join('\n'),
		'/basics': 'Prompt basics: objective, constraints, context, and expected output.',
		'/system-instructions':
			'System instructions: define authority, safety boundary, and response contract.',
		'/agent-design':
			'Agent design: tool usage rules, failure handling, and retry/validation strategy.',
		'/formatting': 'Formatting: output schema, markdown structure, and parseable sections.'
	},
	internalRoutes: {
		home: '/',
		ai: '/ai',
		css: '/css',
		aws: '/aws',
		about: '/about',
		basics: '/ai/basics',
		'system-instructions': '/ai/system-instructions',
		'agent-design': '/ai/agent-design',
		formatting: '/ai/formatting',
		'/': '/',
		'/ai': '/ai',
		'/css': '/css',
		'/aws': '/aws',
		'/about': '/about',
		'/basics': '/ai/basics',
		'/system-instructions': '/ai/system-instructions',
		'/agent-design': '/ai/agent-design',
		'/formatting': '/ai/formatting'
	},
	helpExamples: [
		'ls',
		'cat README.md',
		'cat basics',
		'open basics',
		'open system-instructions',
		'open agent-design',
		'open formatting'
	],
	hint: 'Try: ls, cat README.md, open basics, open system-instructions, open agent-design',
	introLines: (date) => [
		'AI Prompt Engineering Terminal',
		`Date: ${date}`,
		'',
		'Available modules:',
		'  - basics',
		'  - system-instructions',
		'  - agent-design',
		'  - formatting',
		'',
		'Commands:',
		'  open basics',
		'  open system-instructions',
		'  open agent-design',
		'  open formatting',
		"Type 'help' for all commands."
	]
};

export const cssTerminalProfile: TerminalProfile = {
	historyKey: 'rr:css:history',
	dirs: {
		'/': ['flex', 'position', 'bfc', 'contain', 'README.md'],
		'/topics': ['ai', 'css', 'aws', 'about']
	},
	files: {
		'/README.md': [
			'CSS Tutorials',
			'',
			"- Run 'open flex' for Flexbox",
			"- Run 'open position' for positioning and stacking",
			"- Run 'open bfc' / 'open contain' for layout isolation"
		].join('\n'),
		'/flex': 'Flexbox: main axis, cross axis, alignment, and shrink/grow trade-offs.',
		'/position': 'Positioning: static/relative/absolute/fixed/sticky and containing blocks.',
		'/bfc': 'BFC: isolate float interaction and avoid margin-collapsing surprises.',
		'/contain': 'Contain: use layout/paint/style containment to reduce side effects.'
	},
	internalRoutes: {
		home: '/',
		ai: '/ai',
		css: '/css',
		aws: '/aws',
		about: '/about',
		flex: '/css/flex',
		position: '/css/position',
		bfc: '/css/bfc',
		contain: '/css/contain',
		'/': '/',
		'/ai': '/ai',
		'/css': '/css',
		'/aws': '/aws',
		'/about': '/about',
		'/flex': '/css/flex',
		'/position': '/css/position',
		'/bfc': '/css/bfc',
		'/contain': '/css/contain'
	},
	helpExamples: [
		'ls',
		'cat README.md',
		'cat flex',
		'open flex',
		'open position',
		'open bfc',
		'open contain'
	],
	hint: 'Try: ls, cat README.md, open flex, open position, open bfc, open contain',
	introLines: (date) => [
		'CSS Layout Terminal',
		`Date: ${date}`,
		'',
		'Available modules:',
		'  - flex',
		'  - position',
		'  - bfc',
		'  - contain',
		'',
		'Commands:',
		'  open flex',
		'  open position',
		'  open bfc',
		'  open contain',
		"Type 'help' for all commands."
	]
};

export const awsTerminalProfile: TerminalProfile = {
	historyKey: 'rr:aws:history',
	dirs: {
		'/': ['cloudformation', 'README.md'],
		'/topics': ['ai', 'css', 'aws', 'about']
	},
	files: {
		'/README.md': [
			'AWS Tutorials',
			'',
			"- Run 'open cloudformation' to read IaC deployment notes",
			"- Run 'cat cloudformation' for a quick summary"
		].join('\n'),
		'/cloudformation':
			'CloudFormation: declarative infra with change sets and rollback-first deployment.'
	},
	internalRoutes: {
		home: '/',
		ai: '/ai',
		css: '/css',
		aws: '/aws',
		about: '/about',
		cloudformation: '/aws/cloudformation',
		'/': '/',
		'/ai': '/ai',
		'/css': '/css',
		'/aws': '/aws',
		'/about': '/about',
		'/cloudformation': '/aws/cloudformation'
	},
	helpExamples: ['ls', 'cat README.md', 'cat cloudformation', 'open cloudformation'],
	hint: 'Try: ls, cat README.md, cat cloudformation, open cloudformation',
	introLines: (date) => [
		'AWS Infra Terminal',
		`Date: ${date}`,
		'',
		'Available modules:',
		'  - cloudformation',
		'',
		'Commands:',
		'  open cloudformation',
		'  cat cloudformation',
		"Type 'help' for all commands."
	]
};
