import type { AppTypes } from '$app/types';

export type TerminalProfile = {
	historyKey: string;
	dirs: Record<string, string[]>;
	files: Record<string, string>;
	// kit 3: AppTypes['Path'] is callable; ReturnType<...> is the path union.
	internalRoutes: Record<string, ReturnType<AppTypes['Path']>>;
	helpExamples: string[];
	hint: string;
	introLines: (date: string) => string[];
};

/**
 * Single persistent shell profile for the global agent terminal (left pane).
 *
 * The virtual filesystem mirrors the real route tree, and `internalRoutes`
 * covers every section landing and article so `open <target>` works no
 * matter which document the right pane is showing.
 */
export const shellTerminalProfile: TerminalProfile = {
	historyKey: 'runrioter-agent-history-v1',
	dirs: {
		'/': [
			'ai',
			'css',
			'aws',
			'about',
			'topics',
			'README.md',
			'profile.txt',
			'focus.txt',
			'writing-style.txt',
			'links.txt'
		],
		'/topics': ['ai', 'css', 'aws', 'about'],
		'/ai': ['basics', 'system-instructions', 'agent-design', 'formatting'],
		'/css': ['bfc', 'contain', 'flex', 'position'],
		'/aws': ['cloudformation'],
		'/about': ['profile.txt', 'focus.txt', 'writing-style.txt', 'links.txt']
	},
	files: {
		'/README.md': [
			'Runrioter Blog',
			'',
			'- Topics: CSS / AWS / AI prompt engineering',
			'- Style: terminal-inspired, practical, source-driven',
			'- Navigate with `open <route>`, or click the document pane',
			"- Try 'help' for available commands"
		].join('\n'),
		'/profile.txt': [
			'Name: Runrioter',
			'Identity: Human-made, AI-free',
			'Role: Developer, writer, builder'
		].join('\n'),
		'/focus.txt': 'CSS layout / AWS infrastructure / AI prompt engineering',
		'/writing-style.txt': [
			'- Practical templates over vague concepts',
			'- Explicit engineering trade-offs',
			'- Short path from idea to implementation'
		].join('\n'),
		'/links.txt': ['GitHub: https://github.com/Runrioter'].join('\n'),
		'/ai/intro': 'AI prompt engineering: from first principles to agent-ready prompts.',
		'/css/intro': 'CSS layout: BFC, contain, flexbox, positioning, predictable behavior.',
		'/aws/intro': 'AWS: deployable and rollback-friendly infrastructure notes.',
		'/ai/basics': 'Prompt basics: objective, constraints, context, and expected output.',
		'/ai/system-instructions':
			'System instructions: define authority, safety boundary, and response contract.',
		'/ai/agent-design':
			'Agent design: tool usage rules, failure handling, and retry/validation strategy.',
		'/ai/formatting': 'Formatting: output schema, markdown structure, and parseable sections.',
		'/css/bfc': 'BFC: isolate float interaction and avoid margin-collapsing surprises.',
		'/css/contain': 'Contain: use layout/paint/style containment to reduce side effects.',
		'/css/flex': 'Flexbox: main axis, cross axis, alignment, and shrink/grow trade-offs.',
		'/css/position': 'Positioning: static/relative/absolute/fixed/sticky and containing blocks.',
		'/aws/cloudformation':
			'CloudFormation: declarative infra with change sets and rollback-first deployment.'
	},
	internalRoutes: {
		home: '',
		'/': '',
		ai: 'ai',
		css: 'css',
		aws: 'aws',
		about: 'about',
		'/ai': 'ai',
		'/css': 'css',
		'/aws': 'aws',
		'/about': 'about',
		basics: 'ai/basics',
		'system-instructions': 'ai/system-instructions',
		'agent-design': 'ai/agent-design',
		formatting: 'ai/formatting',
		'/ai/basics': 'ai/basics',
		'/ai/system-instructions': 'ai/system-instructions',
		'/ai/agent-design': 'ai/agent-design',
		'/ai/formatting': 'ai/formatting',
		bfc: 'css/bfc',
		contain: 'css/contain',
		flex: 'css/flex',
		position: 'css/position',
		'/css/bfc': 'css/bfc',
		'/css/contain': 'css/contain',
		'/css/flex': 'css/flex',
		'/css/position': 'css/position',
		cloudformation: 'aws/cloudformation',
		'/aws/cloudformation': 'aws/cloudformation'
	},
	helpExamples: [
		'whoami',
		'cat README.md',
		'ls -la topics/',
		'cat ai/intro',
		'cd css',
		'open basics',
		'open github'
	],
	hint: 'Try: help, whoami, cat README.md, open basics, open github — or click the document pane',
	introLines: (date) => [
		// Version = the released `v*` git tag, injected at compile time
		// (see vite.config.ts → __APP_VERSION__, app.d.ts).
		`Runrioter Blog Agent v${__APP_VERSION__}`,
		`Date: ${date}`,
		'',
		'Navigate with commands (`open`, `cd`), or click links in the document pane.',
		'The document pane follows every navigation.',
		'Type help to list available commands.'
	]
};
