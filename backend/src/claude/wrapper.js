import pty from 'node-pty';
import { EventEmitter } from 'events';

export class ClaudeWrapper extends EventEmitter {
  constructor(workingDir) {
    super();
    this.workingDir = workingDir;
    this.pty = null;
    this.isRunning = false;
  }

  spawn(cols = 120, rows = 40) {
    if (this.pty) {
      return this.pty;
    }

    // Spawn claude CLI with PTY
    this.pty = pty.spawn('claude', [], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: this.workingDir,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor'
      }
    });

    this.isRunning = true;

    // Handle output
    this.pty.onData((data) => {
      this.emit('output', data);
    });

    // Handle exit
    this.pty.onExit(({ exitCode, signal }) => {
      this.isRunning = false;
      this.emit('exit', { exitCode, signal });
    });

    return this.pty;
  }

  write(data) {
    if (this.pty) {
      this.pty.write(data);
    }
  }

  resize(cols, rows) {
    if (this.pty) {
      this.pty.resize(cols, rows);
    }
  }

  kill(signal = 'SIGTERM') {
    if (this.pty) {
      this.pty.kill(signal);
      this.pty = null;
      this.isRunning = false;
    }
  }

  sendSignal(signal) {
    if (this.pty) {
      // Send Ctrl+C
      if (signal === 'SIGINT') {
        this.pty.write('\x03');
      }
      // Send Ctrl+D
      else if (signal === 'EOF') {
        this.pty.write('\x04');
      }
    }
  }
}
