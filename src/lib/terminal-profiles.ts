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
			'dev',
			'about',
			'about.md',
			'topics',
			'README.md',
			'profile.txt',
			'focus.txt',
			'writing-style.txt',
			'links.txt'
		],
		'/topics': ['ai', 'css', 'aws', 'dev', 'about.md'],
		'/ai': ['basics.md', 'system-instructions.md', 'agent-design.md', 'formatting.md'],
		'/css': ['bfc.md', 'contain.md', 'flex.md', 'position.md'],
		'/aws': ['cloudformation.md'],
		'/dev': ['makefile-shell-quoting.md'],
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
		'/dev/intro': 'Dev engineering: build tooling, make/shell syntax boundaries, debugging notes.',
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
			'CloudFormation: declarative infra with change sets and rollback-first deployment.',
		'/dev/makefile-shell-quoting':
			'Makefile/shell quoting: why a backslash escape inside $(...) broke the release log.'
	},
	internalRoutes: {
		home: '',
		'/': '',
		// directories (sections and the about pseudo-dir) keep bare names
		ai: 'ai',
		css: 'css',
		aws: 'aws',
		dev: 'dev',
		about: 'about.md',
		'/ai': 'ai',
		'/css': 'css',
		'/aws': 'aws',
		'/dev': 'dev',
		'/about': 'about.md',
		// articles are .md files — bare article names are NOT accepted (0 compat)
		'about.md': 'about.md',
		'/about.md': 'about.md',
		'basics.md': 'ai/basics.md',
		'system-instructions.md': 'ai/system-instructions.md',
		'agent-design.md': 'ai/agent-design.md',
		'formatting.md': 'ai/formatting.md',
		'/ai/basics.md': 'ai/basics.md',
		'/ai/system-instructions.md': 'ai/system-instructions.md',
		'/ai/agent-design.md': 'ai/agent-design.md',
		'/ai/formatting.md': 'ai/formatting.md',
		'bfc.md': 'css/bfc.md',
		'contain.md': 'css/contain.md',
		'flex.md': 'css/flex.md',
		'position.md': 'css/position.md',
		'/css/bfc.md': 'css/bfc.md',
		'/css/contain.md': 'css/contain.md',
		'/css/flex.md': 'css/flex.md',
		'/css/position.md': 'css/position.md',
		'cloudformation.md': 'aws/cloudformation.md',
		'/aws/cloudformation.md': 'aws/cloudformation.md',
		'makefile-shell-quoting.md': 'dev/makefile-shell-quoting.md',
		'/dev/makefile-shell-quoting.md': 'dev/makefile-shell-quoting.md'
	},
	helpExamples: [
		'whoami',
		'cat README.md',
		'ls -la topics/',
		'cat ai/intro',
		'cd css',
		'open about.md',
		'open github'
	],
	hint: 'Try: help, whoami, cat README.md, open about.md, open github — or click the document pane',
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
