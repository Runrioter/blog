<script lang="ts">
	import { browser } from '$app/env';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import type { Path } from '$app/types';
	import { onMount } from 'svelte';
	import '@xterm/xterm/css/xterm.css';
	import type { Terminal } from '@xterm/xterm';

	type FSMap = Record<string, string[]>;
	type FileMap = Record<string, string>;
	type RouteMap = Record<string, Path>;

	let {
		historyKey,
		introLines = [],
		hint = '',
		dirs,
		files,
		internalRoutes,
		whoamiLine = 'runrioter - developer, writer, builder',
		helpExamples = ['whoami', 'cat README.md', 'open github'],
		registerApi = () => {},
		onSelfNavigate = () => {}
	}: {
		historyKey: string;
		introLines?: string[];
		hint?: string;
		dirs: FSMap;
		files: FileMap;
		internalRoutes: RouteMap;
		whoamiLine?: string;
		helpExamples?: string[];
		registerApi?: (api: { echoCommand: (line: string) => void }) => void;
		onSelfNavigate?: () => void;
	} = $props();

	let host: HTMLDivElement;
	let term: Terminal | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let commandBuffer = '';
	let cursorPos = 0;
	let currentDir = '/';
	let commandHistory: string[] = [];
	let historyIndex: number | null = null;

	const aliases: Record<string, string> = {
		ll: 'ls -la',
		cls: 'clear',
		gh: 'open github'
	};

	const commandNames = ['help', 'man', 'ls', 'cd', 'pwd', 'cat', 'open', 'clear', 'whoami'];

	const commandDocs: Record<string, string[]> = {
		help: ['help [command]', 'Show global help or details for a command.'],
		man: ['man <command>', 'Show full manual text for one command.'],
		ls: ['ls [path]', 'List virtual folders/files under a path. Supports flags like -la.'],
		cd: ['cd <path>', 'Change current virtual directory.'],
		pwd: ['pwd', 'Print current virtual directory.'],
		cat: ['cat <file>', 'Print virtual file content.'],
		open: ['open <target>', 'Open internal route target or external url.'],
		clear: ['clear', 'Clear terminal output area.'],
		whoami: ['whoami', 'Print author identity.'],
		ll: ['ll', 'Alias for: ls -la'],
		cls: ['cls', 'Alias for: clear'],
		gh: ['gh', 'Alias for: open github']
	};

	const prompt = () => `\x1b[32m${currentDir === '/' ? '~' : `~${currentDir}`}\x1b[0m $ `;

	function writeLine(text = '') {
		term?.writeln(text);
	}

	/**
	 * Fit the grid to the pane. The @xterm/xterm core bundle no longer ships
	 * FitAddon, so we derive rows/cols from the measured character cell and
	 * resize the grid to fill the container — otherwise the terminal keeps its
	 * initial size and leaves an empty black band below the prompt.
	 */
	function fit() {
		if (!term) return;
		const { clientWidth, clientHeight } = host;
		if (clientWidth === 0 || clientHeight === 0) return;
		// Cell width comes from xterm's own width-measure element (N identical
		// characters → width/length = exact per-cell width for the loaded font).
		// A rendered row span must NOT be used: xterm packs a whole run of
		// same-styled characters into one span, which over-measures the cell
		// and shrinks the grid (every line then clips at the pane edge).
		const measure = host.querySelector('.xterm-char-measure-element');
		const measureText = measure?.textContent ?? '';
		const row = host.querySelector('.xterm-rows > div');
		if (!measure || !measureText || !row) return;
		const cellW = measure.getBoundingClientRect().width / measureText.length;
		const cellH = row.getBoundingClientRect().height;
		if (cellW <= 0 || cellH <= 0) return;
		const cols = Math.max(2, Math.floor(clientWidth / cellW));
		const rows = Math.max(1, Math.floor(clientHeight / cellH));
		if (cols !== term.cols || rows !== term.rows) term.resize(cols, rows);
	}

	/**
	 * Echo a pseudo user line (used when the document pane navigates by
	 * clicking a link, so the terminal and the doc stay in sync visually).
	 * Preserves any in-progress input buffer.
	 */
	/** Approximate display width of a string (CJK / fullwidth / emoji = 2 cells). */
	function displayWidth(text: string): number {
		let w = 0;
		for (const ch of text) {
			const cp = ch.codePointAt(0) ?? 0;
			const wide =
				(cp >= 0x1100 && cp <= 0x115f) ||
				(cp >= 0x2e80 && cp <= 0xa4cf) ||
				(cp >= 0xac00 && cp <= 0xd7a3) ||
				(cp >= 0xf900 && cp <= 0xff60) ||
				cp >= 0x1f300;
			w += wide ? 2 : 1;
		}
		return w;
	}

	/** One display row the input may occupy (prompt + buffer). */
	function inputCols(): number {
		return Math.max(1, term?.cols ?? 80);
	}

	/** Redraw the in-progress input (prompt + buffer) on the current row.
	 * Input is capped at one display row, so a single erase-line + rewrite is
	 * always correct regardless of the cursor column. */
	function redrawInput() {
		if (!term) return;
		term.write(`\x1b[2K\r${prompt()}${commandBuffer}`);
		const rightChars = commandBuffer.length - cursorPos;
		if (rightChars > 0) {
			term.write(`\x1b[${rightChars}D`);
		}
	}

	function echoCommand(line: string) {
		if (!term) return;
		term.write('\x1b[2K\r');
		writeLine(`${prompt()}${line}`);
		writeLine();
		redrawInput();
	}

	function setInput(value: string) {
		commandBuffer = value;
		cursorPos = value.length;
		redrawInput();
	}

	function loadHistory() {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(historyKey);
			if (!raw) return;
			const parsed = JSON.parse(raw) as unknown;
			if (Array.isArray(parsed)) {
				commandHistory = parsed.filter((x): x is string => typeof x === 'string').slice(-100);
			}
		} catch {
			commandHistory = [];
		}
	}

	function persistHistory() {
		if (!browser) return;
		try {
			localStorage.setItem(historyKey, JSON.stringify(commandHistory.slice(-100)));
		} catch {
			// Ignore storage quota/private mode failures.
		}
	}

	function printCommandDoc(name?: string, full = false) {
		if (!name) {
			writeLine(full ? 'man: missing command name' : 'help: missing command name');
			return;
		}

		const key = name.toLowerCase();
		const doc = commandDocs[key];
		if (!doc) {
			writeLine(`${full ? 'man' : 'help'}: no manual entry for '${name}'`);
			return;
		}

		writeLine('NAME');
		writeLine(`  ${doc[0]}`);
		writeLine('');
		writeLine('DESCRIPTION');
		writeLine(`  ${doc[1]}`);
		if (full) {
			writeLine('');
			writeLine('RELATED');
			writeLine('  help, ls, cd, cat, open, clear, whoami, aliases(ll/cls/gh)');
		}
	}

	function normalizePath(path: string): string {
		const parts = path.split('/');
		const stack: string[] = [];

		for (const segment of parts) {
			if (!segment || segment === '.') continue;
			if (segment === '..') {
				stack.pop();
				continue;
			}
			stack.push(segment);
		}

		const joined = `/${stack.join('/')}`;
		return joined === '' ? '/' : joined;
	}

	function resolvePath(input?: string): string {
		if (!input || input === '~') return currentDir;
		if (input.startsWith('/')) return normalizePath(input);
		return normalizePath(`${currentDir}/${input}`);
	}

	function listPath(path: string) {
		if (!dirs[path]) {
			writeLine(`ls: cannot access '${path}': No such file or directory`);
			return;
		}

		writeLine(dirs[path].join('  '));
	}

	function catPath(target?: string) {
		if (!target) {
			writeLine('cat: missing operand');
			return;
		}

		const path = resolvePath(target);
		if (dirs[path]) {
			writeLine(`cat: ${target}: Is a directory`);
			return;
		}

		if (!files[path]) {
			writeLine(`cat: ${target}: No such file`);
			return;
		}

		for (const line of files[path].split('\n')) writeLine(line);
	}

	async function openTarget(target?: string) {
		if (!target) {
			writeLine('open: missing target');
			return;
		}

		if (target === 'github') {
			window.open('https://github.com/Runrioter', '_blank', 'noopener,noreferrer');
			writeLine('Opening https://github.com/Runrioter');
			return;
		}

		if (target.startsWith('http://') || target.startsWith('https://')) {
			window.open(target, '_blank', 'noopener,noreferrer');
			writeLine(`Opening ${target}`);
			return;
		}

		const mapped = internalRoutes[target] ?? internalRoutes[resolvePath(target)];
		if (mapped) {
			const resolved = resolve(mapped);
			void goto(resolved);
			onSelfNavigate();
			writeLine(`Navigating to ${resolved}`);
			return;
		}

		writeLine(`open: unsupported target '${target}'`);
	}

	async function runCommand(raw: string) {
		if (!raw) return;

		const rawParts = raw.split(/\s+/);
		const maybeAlias = rawParts[0]?.toLowerCase() ?? '';
		const expanded = aliases[maybeAlias]
			? `${aliases[maybeAlias]} ${rawParts.slice(1).join(' ')}`.trim()
			: raw;
		const parts = expanded.split(/\s+/);
		const command = parts[0]?.toLowerCase() ?? '';
		const args = parts.slice(1);

		switch (command) {
			case 'help': {
				if (args[0]) {
					printCommandDoc(args[0], false);
					break;
				}

				writeLine('Available commands:');
				writeLine('  help                Show this help');
				writeLine('  help <command>      Show a command quick help');
				writeLine('  man <command>       Show detailed command manual');
				writeLine('  ls [path]           List virtual files/folders');
				writeLine('  cd <path>           Change virtual folder');
				writeLine('  pwd                 Print current virtual folder');
				writeLine('  cat <file>          Print virtual file content');
				writeLine('  open <target>       Open route/url (e.g. github, ai, https://...)');
				writeLine('  clear               Clear terminal output');
				writeLine('  whoami              Print author identity');
				writeLine('');
				writeLine('Aliases: ll, cls, gh');
				writeLine(
					'Shell keys: Up/Down history, Left/Right edit, Tab completion, Del, Ctrl+A/E/L/C'
				);
				writeLine('');
				writeLine('Try examples:');
				for (const example of helpExamples) {
					writeLine(`  ${example}`);
				}
				break;
			}
			case 'man': {
				printCommandDoc(args[0], true);
				break;
			}
			case 'pwd': {
				writeLine(currentDir);
				break;
			}
			case 'whoami': {
				writeLine(whoamiLine);
				break;
			}
			case 'clear': {
				term?.clear();
				break;
			}
			case 'ls': {
				const firstNonFlag = args.find((arg) => !arg.startsWith('-'));
				const target = resolvePath(firstNonFlag);
				listPath(target);
				break;
			}
			case 'cd': {
				const target = resolvePath(args[0]);
				if (!dirs[target]) {
					writeLine(`cd: no such file or directory: ${args[0] ?? ''}`);
					break;
				}

				currentDir = target;
				break;
			}
			case 'cat': {
				catPath(args[0]);
				break;
			}
			case 'open': {
				await openTarget(args[0]);
				break;
			}
			default: {
				writeLine(`${command}: command not found`);
			}
		}
	}

	function commonPrefix(values: string[]): string {
		if (values.length === 0) return '';
		let prefix = values[0] ?? '';
		for (const value of values.slice(1)) {
			while (!value.startsWith(prefix) && prefix.length > 0) {
				prefix = prefix.slice(0, -1);
			}
		}
		return prefix;
	}

	function completeInput() {
		const trimmed = commandBuffer.trimStart();
		const endsWithSpace = /\s$/.test(commandBuffer);
		const tokens = trimmed.split(/\s+/).filter(Boolean);

		if (tokens.length === 0) {
			writeLine();
			writeLine([...commandNames, ...Object.keys(aliases)].join('  '));
			term?.write(prompt());
			return;
		}

		if (tokens.length === 1 && !endsWithSpace) {
			const head = tokens[0] ?? '';
			const candidates = [...commandNames, ...Object.keys(aliases)].filter((c) =>
				c.startsWith(head)
			);
			if (candidates.length === 0) return;
			if (candidates.length === 1) {
				setInput(candidates[0] ?? head);
				return;
			}

			const prefix = commonPrefix(candidates);
			if (prefix.length > head.length) {
				setInput(prefix);
				return;
			}

			writeLine();
			writeLine(candidates.join('  '));
			term?.write(prompt() + commandBuffer);
			return;
		}

		const command = tokens[0] ?? '';
		const partial = endsWithSpace ? '' : (tokens[tokens.length - 1] ?? '');
		const partialPath = resolvePath(partial);

		let candidates: string[] = [];
		if (command === 'cd' || command === 'ls') {
			candidates = Object.keys(dirs)
				.filter((dir) => dir !== '/')
				.map((dir) => dir.slice(1))
				.filter((dir) => dir.startsWith(partial.replace(/^\//, '')));
		}

		if (command === 'cat') {
			candidates = Object.keys(files)
				.map((file) => file.slice(1))
				.filter((file) => file.startsWith(partialPath.slice(1)) || file.startsWith(partial));
		}

		if (command === 'open') {
			candidates = [...Object.keys(internalRoutes), 'github'].filter((target) =>
				target.startsWith(partial)
			);
		}

		if (candidates.length === 0) return;
		if (candidates.length === 1) {
			const only = candidates[0] ?? '';
			const baseTokens = endsWithSpace ? tokens : tokens.slice(0, -1);
			setInput([...baseTokens, only].join(' '));
			return;
		}

		const prefix = commonPrefix(candidates);
		if (prefix.length > partial.length) {
			const baseTokens = endsWithSpace ? tokens : tokens.slice(0, -1);
			setInput([...baseTokens, prefix].join(' '));
			return;
		}

		writeLine();
		writeLine(candidates.join('  '));
		term?.write(prompt() + commandBuffer);
	}

	onMount(() => {
		if (!browser) return;
		loadHistory();

		let unmounted = false;
		let disposable: { dispose: () => void } | null = null;

		const init = async () => {
			const mod = await import('@xterm/xterm');
			if (unmounted) return;

			term = new mod.Terminal({
				// xterm 6 always wraps lines at the grid edge (the v5 wordWrap
				// option is gone), so the only lever is a correct column fit.
				allowTransparency: true,
				convertEol: true,
				cursorBlink: true,
				fontFamily: 'Fira Mono, Menlo, Monaco, monospace',
				fontSize: 13,
				theme: {
					background: '#0d1117',
					foreground: '#c9d1d9',
					cursor: '#3fb950',
					black: '#0d1117',
					green: '#3fb950',
					blue: '#58a6ff',
					red: '#f85149',
					yellow: '#d29922',
					brightBlack: '#6e7681'
				}
			});

			term.open(host);
			term.focus();
			fit();
			registerApi({ echoCommand });
			for (const line of introLines) {
				writeLine(line);
			}
			if (hint) {
				writeLine(`\x1b[2m${hint}\x1b[0m`);
			}
			if (introLines.length > 0 || hint) writeLine('');
			term.write(prompt());

			resizeObserver = new ResizeObserver(() => fit());
			resizeObserver.observe(host);

			// The mono font loads asynchronously; its cell width can change after
			// layout without changing the host box (which ResizeObserver misses).
			// Re-fit on font ready, and keep settling for a couple of seconds so
			// a late font swap re-sizes the grid instead of leaving it narrow
			// (clipped lines) or wide (overflow past the pane).
			document.fonts?.ready.then(() => fit());
			let settleFrames = 0;
			const settle = () => {
				fit();
				if (settleFrames < 180) {
					settleFrames += 1;
					requestAnimationFrame(settle);
				}
			};
			requestAnimationFrame(settle);

			disposable = term.onData(async (data) => {
				if (!term) return;

				// Input is capped at one display row and echoed with append/erase
				// primitives (never a full multi-row rewrite), so lines can grow to
				// the pane edge and wrap visually without corrupting the buffer.

				if (data === '\u0001') {
					// Ctrl-A: home
					if (cursorPos === 0) return;
					cursorPos = 0;
					term.write('\x1b[G');
					return;
				}

				if (data === '\u0005') {
					// Ctrl-E: end
					if (cursorPos >= commandBuffer.length) return;
					cursorPos = commandBuffer.length;
					term.write('\x1b[400C');
					return;
				}

				if (data === '\u000c') {
					term.clear();
					redrawInput();
					return;
				}

				if (data === '\u001b[D') {
					if (cursorPos === 0) return;
					cursorPos -= 1;
					term.write('\x1b[1D');
					return;
				}

				if (data === '\u001b[C') {
					if (cursorPos >= commandBuffer.length) return;
					cursorPos += 1;
					term.write('\x1b[1C');
					return;
				}

				if (data === '\u001b[A') {
					if (commandHistory.length === 0) return;
					if (historyIndex === null) {
						historyIndex = commandHistory.length - 1;
					} else {
						historyIndex = Math.max(0, historyIndex - 1);
					}
					setInput(commandHistory[historyIndex] ?? '');
					return;
				}

				if (data === '\u001b[B') {
					if (commandHistory.length === 0 || historyIndex === null) return;
					if (historyIndex >= commandHistory.length - 1) {
						historyIndex = null;
						setInput('');
					} else {
						historyIndex += 1;
						setInput(commandHistory[historyIndex] ?? '');
					}
					return;
				}

				if (data === '\t') {
					completeInput();
					return;
				}

				if (data === '\r') {
					// Return the cursor to the end of the input before consuming it.
					term.write('\x1b[400C');
					const cmd = commandBuffer.trim();
					term.write('\r\n');
					commandBuffer = '';
					cursorPos = 0;
					historyIndex = null;
					if (cmd) {
						if (commandHistory.at(-1) !== cmd) {
							commandHistory.push(cmd);
						}
						if (commandHistory.length > 100) {
							commandHistory = commandHistory.slice(-100);
						}
						persistHistory();
					}
					await runCommand(cmd);
					term.write(prompt());
					return;
				}

				if (data === '\u0003') {
					// ^C: erase the row, interrupt, fresh prompt.
					term.write('\x1b[2K\r');
					commandBuffer = '';
					cursorPos = 0;
					term.write('^C\r\n');
					term.write(prompt());
					return;
				}

				if (data === '\u007F') {
					if (cursorPos === 0) return;
					commandBuffer = commandBuffer.slice(0, cursorPos - 1) + commandBuffer.slice(cursorPos);
					cursorPos -= 1;
					term.write('\x1b[1D\x1b[P');
					return;
				}

				if (data === '\u001b[3~') {
					if (cursorPos >= commandBuffer.length) return;
					commandBuffer = commandBuffer.slice(0, cursorPos) + commandBuffer.slice(cursorPos + 1);
					term.write('\x1b[P');
					return;
				}

				if (/^[\x20-\x7E]$/.test(data)) {
					// Cap the input at one display row: drop the char that would
					// wrap it (shell `read`-like), so the line stays a single row.
					const cols = inputCols();
					if (displayWidth(`${prompt()}${commandBuffer}`) + 1 > cols) {
						return;
					}
					const rest = commandBuffer.slice(cursorPos + data.length);
					commandBuffer = commandBuffer.slice(0, cursorPos) + data + commandBuffer.slice(cursorPos);
					cursorPos += data.length;
					// Append (or, when editing mid-line, append + overwrite the rest
					// so the row always mirrors the buffer).
					term.write(data + rest);
				}
			});
		};

		void init();

		return () => {
			unmounted = true;
			resizeObserver?.disconnect();
			resizeObserver = null;
			disposable?.dispose();
			term?.dispose();
			term = null;
		};
	});
</script>

<div class="interactive-terminal">
	<div bind:this={host} class="terminal-host"></div>
</div>

<style>
	.interactive-terminal {
		flex: 1;
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
	}

	.terminal-host {
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	:global(.terminal-host .xterm) {
		height: 100%;
	}

	:global(.terminal-host .xterm-viewport) {
		overflow-y: auto !important;
	}
</style>
