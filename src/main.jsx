import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './effects.css';

const buildings = [
  { id: 'raptor', icon: '🦖', name: 'Certified Tax Raptor', note: 'Audits fractions at speed.', base: 80, gps: 0.2 },
  { id: 'rocket', icon: '🚀', name: 'Ballistic Homework Launcher', note: 'Sends worksheets into orbit.', base: 550, gps: 1 },
  { id: 'trooper', icon: '⚔', name: 'Galactic Goon Academy', note: 'Trains the dark side of X.', base: 4000, gps: 8 },
  { id: 'lab', icon: '◉', name: 'Orbital Algebra Prison', note: 'No variable escapes alive.', base: 28000, gps: 47 },
  { id: 'fleet', icon: '△', name: 'Jurassic Space Program', note: 'Weaponized prehistoric science.', base: 190000, gps: 260 },
  { id: 'satellite', icon: '📡', name: 'Goon Propaganda Satellite', note: 'Broadcasts brainrot galaxy-wide.', base: 1300000, gps: 1800 },
  { id: 'embassy', icon: '♜', name: 'Intergalactic Goon Embassy', note: 'Diplomatic immunity for gooning.', base: 9000000, gps: 12000 },
  { id: 'singularity', icon: '●', name: 'Infinite Goon Singularity', note: 'Physics has left the server.', base: 75000000, gps: 85000 },
  { id: 'dyson', icon: '☀', name: 'Goon Dyson Swarm', note: 'Drains a star to power the grind.', base: 650000000, gps: 650000 },
  { id: 'multiverse', icon: '∞', name: 'Multiverse Goon Foundry', note: 'Every timeline clocks in at once.', base: 6000000000, gps: 5000000 }
];

const upgrades = [
  { id: 'strong-arm', art: 'arm', name: 'Stronger Arm', note: 'Manual goons ×2', cost: 500, effect: 'click', multiplier: 2 },
  { id: 'titan-knuckles', art: 'knuckles', name: 'OnlyFans Top Donor', note: 'Manual goons ×3', cost: 7500, effect: 'click', multiplier: 3 },
  { id: 'goon-diploma', art: 'diploma', name: 'Goon Academy Diploma', note: 'Manual goons ×5', cost: 60000, effect: 'click', multiplier: 5 },
  { id: 'diamond-wrist', art: 'diamond', name: 'Diamond Wrist Surgery', note: 'Manual goons ×10', cost: 750000, effect: 'click', multiplier: 10 },
  { id: 'laser-eyes', art: 'optic', name: 'Dino Optometrist', note: 'Factories produce ×2', cost: 24000, effect: 'auto', multiplier: 2 },
  { id: 'war-drums', art: 'drum', name: 'Primal Hype Squad', note: 'Factories produce ×3', cost: 90000, effect: 'auto', multiplier: 3 },
  { id: 'goon-accountant', art: 'accountant', name: 'Certified Goon Accountant', note: 'Factories produce ×5', cost: 1500000, effect: 'auto', multiplier: 5 },
  { id: 'moon-core', art: 'core', name: 'Illegal Moon Reactor', note: 'Everything produces ×2', cost: 350000, effect: 'all', multiplier: 2 },
  { id: 'goon-license', art: 'license', name: 'Intergalactic Goon License', note: 'Everything produces ×3', cost: 8000000, effect: 'all', multiplier: 3 },
  { id: 'forbidden-core', art: 'singularity', name: 'Forbidden Goon Singularity', note: 'Everything produces ×5', cost: 75000000, effect: 'all', multiplier: 5 },
  { id: 'dino-overclock', art: 'optic', name: 'Dino Laser Overclock', note: 'Factories produce ×8', cost: 180000000, effect: 'auto', multiplier: 8 },
  { id: 'titan-wrist', art: 'knuckles', name: 'Titan Wrist Implant', note: 'Manual goons ×25', cost: 550000000, effect: 'click', multiplier: 25 },
  { id: 'donor-crown', art: 'diamond', name: 'Top Donor Galactic Crown', note: 'Everything produces ×10', cost: 2500000000, effect: 'all', multiplier: 10 },
  { id: 'academy-empire', art: 'diploma', name: 'Goon Academy Empire', note: 'Factories produce ×25', cost: 18000000000, effect: 'auto', multiplier: 25 },
  { id: 'reality-pass', art: 'license', name: 'Reality-Bending Battle Pass', note: 'Everything produces ×50', cost: 150000000000, effect: 'all', multiplier: 50 }
];

function getPowerMultipliers(ids = []) {
  return upgrades.reduce((power, upgrade) => {
    if (!ids.includes(upgrade.id)) return power;
    if (upgrade.effect === 'click' || upgrade.effect === 'all') power.click *= upgrade.multiplier;
    if (upgrade.effect === 'auto' || upgrade.effect === 'all') power.auto *= upgrade.multiplier;
    return power;
  }, { click: 1, auto: 1 });
}

function normalizeUpgradeIds(ids = []) {
  const legacy = { chalk: 'strong-arm', helmet: 'laser-eyes', meteor: 'war-drums' };
  return [...new Set(ids.map(id => legacy[id] || id).filter(id => upgrades.some(upgrade => upgrade.id === id)))];
}

const emptyOwned = Object.fromEntries(buildings.map(item => [item.id, 0]));
const sudokuPuzzle = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9];
const sudokuSolution = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const hardSudokuPuzzle = [0,0,0,0,0,0,0,1,0,4,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,5,0,4,0,7,0,0,8,0,0,0,3,0,0,0,0,1,0,9,0,0,0,0,3,0,0,4,0,0,2,0,0,0,5,0,1,0,0,0,0,0,0,0,0,8,0,6,0,0,0];
const hardSudokuSolution = [6,9,3,7,8,4,5,1,2,4,8,7,5,1,2,9,3,6,1,2,5,9,6,3,8,7,4,9,3,2,6,5,1,4,8,7,5,6,8,2,4,7,3,9,1,7,4,1,3,9,8,6,2,5,3,1,9,4,7,5,2,6,8,8,5,6,1,2,9,7,4,3,2,7,4,8,3,6,1,5,9];
const easySudokuPuzzle = sudokuPuzzle.map((value, index) => value || (index % 4 === 0 ? sudokuSolution[index] : 0));
const sudokuLevels = {
  easy: { label: 'EASY', reward: 150, puzzle: easySudokuPuzzle, solution: sudokuSolution },
  medium: { label: 'MEDIUM', reward: 350, puzzle: sudokuPuzzle, solution: sudokuSolution },
  hard: { label: 'HARD', reward: 900, puzzle: hardSudokuPuzzle, solution: hardSudokuSolution }
};

function makeSudoku(source, puzzleIndex) {
  const offset = puzzleIndex % 9;
  const shifted = source.map(value => value ? ((value + offset - 1) % 9) + 1 : 0);
  if (Math.floor(puzzleIndex / 9) % 2 === 0) return shifted;
  return shifted.map((_, index) => shifted[(index % 9) * 9 + Math.floor(index / 9)]);
}

const multiplicationModes = {
  quick: { label: '2 DIGIT × 1 DIGIT', reward: 90 },
  elite: { label: '2 DIGIT × 2 DIGIT', reward: 350 }
};

function makeMultiplication(mode) {
  const left = Math.floor(Math.random() * 90) + 10;
  const right = mode === 'elite' ? Math.floor(Math.random() * 90) + 10 : Math.floor(Math.random() * 8) + 2;
  return { left, right };
}
let audioContext;
let selectedGoonVoice;

function pickGoonVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  selectedGoonVoice = voices.find(voice => /^sl(-|_)/i.test(voice.lang)) || voices.find(voice => /david|mark|george|daniel|male/i.test(voice.name)) || voices.find(voice => /^en(-|_)/i.test(voice.lang)) || voices[0];
}

function playGoonSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext ||= new AudioContext();
  if (audioContext.state === 'suspended') audioContext.resume();
  const now = audioContext.currentTime;
  const duration = 0.46;
  const splashBuffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * duration), audioContext.sampleRate);
  const data = splashBuffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    const decay = Math.pow(1 - index / data.length, 2.8);
    data[index] = (Math.random() * 2 - 1) * decay;
  }
  const splash = audioContext.createBufferSource();
  const splashFilter = audioContext.createBiquadFilter();
  const splashGain = audioContext.createGain();
  const bubble = audioContext.createOscillator();
  const bubbleGain = audioContext.createGain();
  splash.buffer = splashBuffer;
  splashFilter.type = 'bandpass';
  splashFilter.Q.value = 0.7;
  splashFilter.frequency.setValueAtTime(1900, now);
  splashFilter.frequency.exponentialRampToValueAtTime(520, now + duration);
  splashGain.gain.setValueAtTime(0.0001, now);
  splashGain.gain.exponentialRampToValueAtTime(0.28, now + 0.012);
  splashGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  bubble.type = 'sine';
  bubble.frequency.setValueAtTime(210, now);
  bubble.frequency.exponentialRampToValueAtTime(72, now + 0.22);
  bubbleGain.gain.setValueAtTime(0.08, now);
  bubbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
  splash.connect(splashFilter);
  splashFilter.connect(splashGain);
  splashGain.connect(audioContext.destination);
  bubble.connect(bubbleGain);
  bubbleGain.connect(audioContext.destination);
  splash.start(now);
  bubble.start(now);
  splash.stop(now + duration);
  bubble.stop(now + 0.24);
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    if (!selectedGoonVoice) pickGoonVoice();
    const utterance = new SpeechSynthesisUtterance('gej sem');
    utterance.lang = 'sl-SI';
    if (selectedGoonVoice) utterance.voice = selectedGoonVoice;
    utterance.pitch = 0.9;
    utterance.rate = 0.92;
    utterance.volume = 0.65;
    window.speechSynthesis.speak(utterance);
  }
}

function compact(value) {
  if (value < 1000) return Math.floor(value).toLocaleString();
  const units = ['K', 'M', 'B', 'T'];
  let scaled = value;
  let index = -1;
  while (scaled >= 1000 && index < units.length - 1) { scaled /= 1000; index += 1; }
  return `${scaled.toFixed(scaled >= 100 ? 0 : 1)}${units[index]}`;
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem('goon-wars-save'));
    if (!saved) return null;
    const savedUpgrades = normalizeUpgradeIds(saved.upgrades);
    const elapsed = Math.min((Date.now() - saved.savedAt) / 1000, 14400);
    const power = getPowerMultipliers(savedUpgrades);
    const gps = buildings.reduce((sum, item) => sum + (saved.owned?.[item.id] || 0) * item.gps, 0) * power.auto;
    return { ...saved, upgrades: savedUpgrades, goons: saved.goons + gps * elapsed, offline: Math.floor(gps * elapsed) };
  } catch { return null; }
}

function App() {
  const saved = useMemo(loadGame, []);
  const [goons, setGoons] = useState(saved?.goons || 0);
  const [lifetimeGoons, setLifetimeGoons] = useState(saved?.lifetimeGoons || 0);
  const [manualGoons, setManualGoons] = useState(saved?.manualGoons || 0);
  const [owned, setOwned] = useState({ ...emptyOwned, ...(saved?.owned || {}) });
  const [boughtUpgrades, setBoughtUpgrades] = useState(saved?.upgrades || []);
  const [battle, setBattle] = useState(0);
  const [toast, setToast] = useState(saved?.offline ? `While away: +${compact(saved.offline)} goons` : 'Click the rival to recruit a goon');
  const [particles, setParticles] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [sudokuOpen, setSudokuOpen] = useState(false);
  const initialSudokuDifficulty = sudokuLevels[saved?.sudokuDifficulty] ? saved.sudokuDifficulty : 'easy';
  const [sudokuDifficulty, setSudokuDifficulty] = useState(initialSudokuDifficulty);
  const [sudokuIndex, setSudokuIndex] = useState(saved?.sudokuIndex || 0);
  const [sudokuValues, setSudokuValues] = useState(() => makeSudoku(sudokuLevels[initialSudokuDifficulty].puzzle, saved?.sudokuIndex || 0).map(value => value || ''));
  const [sudokuStatus, setSudokuStatus] = useState(`Complete the grid for +${sudokuLevels[initialSudokuDifficulty].reward} goons.`);
  const [sudokuTransitioning, setSudokuTransitioning] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [mathMode, setMathMode] = useState('quick');
  const [mathProblem, setMathProblem] = useState(() => makeMultiplication('quick'));
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathStatus, setMathStatus] = useState('Solve the multiplication to earn bonus goons.');

  const power = getPowerMultipliers(boughtUpgrades);
  const clickPower = power.click;
  const gps = buildings.reduce((sum, item) => sum + owned[item.id] * item.gps, 0) * power.auto;
  const buildingPrice = item => Math.ceil(item.base * Math.pow(1.15, owned[item.id]));
  const currentSudokuLevel = sudokuLevels[sudokuDifficulty];
  const currentSudokuPuzzle = useMemo(() => makeSudoku(currentSudokuLevel.puzzle, sudokuIndex), [currentSudokuLevel, sudokuIndex]);
  const currentSudokuSolution = useMemo(() => makeSudoku(currentSudokuLevel.solution, sudokuIndex), [currentSudokuLevel, sudokuIndex]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    pickGoonVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickGoonVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickGoonVoice);
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (!gps) return;
      const earned = gps / 10;
      setGoons(value => value + earned);
      setLifetimeGoons(value => value + earned);
    }, 100);
    return () => window.clearInterval(tick);
  }, [gps]);

  useEffect(() => {
    const save = window.setInterval(() => localStorage.setItem('goon-wars-save', JSON.stringify({ goons, lifetimeGoons, manualGoons, owned, upgrades: boughtUpgrades, sudokuDifficulty, sudokuIndex, savedAt: Date.now() })), 3000);
    return () => window.clearInterval(save);
  }, [goons, lifetimeGoons, manualGoons, owned, boughtUpgrades, sudokuDifficulty, sudokuIndex]);

  function recruit(event) {
    if (soundOn) playGoonSound();
    setGoons(value => value + clickPower);
    setLifetimeGoons(value => value + clickPower);
    setManualGoons(value => value + clickPower);
    setBattle(value => value + 1);
    setToast(`+${clickPower} GOON${clickPower === 1 ? '' : 'S'}`);
    const id = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    setParticles(list => [...list.slice(-8), { id, x: event.clientX - rect.left, y: event.clientY - rect.top }]);
    window.setTimeout(() => setParticles(list => list.filter(item => item.id !== id)), 700);
  }

  function buyBuilding(item) {
    const cost = buildingPrice(item);
    if (goons < cost) { setToast(`Need ${compact(cost - goons)} more goons`); return; }
    setGoons(value => value - cost);
    setOwned(value => ({ ...value, [item.id]: value[item.id] + 1 }));
    setToast(`${item.name} acquired`);
  }

  function buyUpgrade(item) {
    if (goons < item.cost || boughtUpgrades.includes(item.id)) return;
    setGoons(value => value - item.cost);
    setBoughtUpgrades(value => [...value, item.id]);
    setToast(`${item.name} activated`);
  }

  function updateSudoku(index, value) {
    if (!/^\d?$/.test(value) || currentSudokuPuzzle[index] || sudokuTransitioning) return;
    setSudokuValues(current => current.map((cell, cellIndex) => cellIndex === index ? value : cell));
    setSudokuStatus('Complete the grid for +250 goons.');
  }

  function checkSudoku() {
    if (sudokuTransitioning) return;
    const solved = sudokuValues.every((value, index) => Number(value) === currentSudokuSolution[index]);
    if (!solved) { setSudokuStatus('Not quite—some squares still need work.'); return; }
    setSudokuTransitioning(true);
    setGoons(value => value + currentSudokuLevel.reward);
    setLifetimeGoons(value => value + currentSudokuLevel.reward);
    setToast(`Sudoku solved · +${currentSudokuLevel.reward} goons`);
    setSudokuStatus('SOLVED · Loading the next grid…');
    window.setTimeout(() => {
      const nextIndex = sudokuIndex + 1;
      setSudokuIndex(nextIndex);
      setSudokuValues(makeSudoku(currentSudokuLevel.puzzle, nextIndex).map(value => value || ''));
      setSudokuStatus(`New ${currentSudokuLevel.label.toLowerCase()} puzzle · +${currentSudokuLevel.reward} goons.`);
      setSudokuTransitioning(false);
    }, 900);
  }

  function resetSudoku() {
    if (sudokuTransitioning) return;
    setSudokuValues(currentSudokuPuzzle.map(value => value || ''));
    setSudokuStatus(`Puzzle reset · Complete it for +${currentSudokuLevel.reward} goons.`);
  }

  function chooseSudokuDifficulty(level) {
    if (sudokuTransitioning || level === sudokuDifficulty) return;
    setSudokuDifficulty(level);
    setSudokuIndex(0);
    setSudokuValues(makeSudoku(sudokuLevels[level].puzzle, 0).map(value => value || ''));
    setSudokuStatus(`${sudokuLevels[level].label} selected · Reward: +${sudokuLevels[level].reward} goons.`);
  }

  function openSudoku() {
    setMathOpen(false);
    setSudokuOpen(true);
  }

  function openMultiplication() {
    setSudokuOpen(false);
    setMathOpen(true);
  }

  function chooseMathMode(mode) {
    setMathMode(mode);
    setMathProblem(makeMultiplication(mode));
    setMathAnswer('');
    setMathStatus(`${multiplicationModes[mode].label} selected · +${multiplicationModes[mode].reward} goons.`);
  }

  function checkMultiplication() {
    if (Number(mathAnswer) !== mathProblem.left * mathProblem.right) {
      setMathStatus('Not quite—check the numbers and try again.');
      return;
    }
    const reward = multiplicationModes[mathMode].reward;
    setGoons(value => value + reward);
    setLifetimeGoons(value => value + reward);
    setToast(`Multiplication solved · +${reward} goons`);
    setMathProblem(makeMultiplication(mathMode));
    setMathAnswer('');
    setMathStatus(`Correct! New problem loaded · +${reward} goons.`);
  }

  const rank = lifetimeGoons < 100 ? 'YOUNGLING' : lifetimeGoons < 1000 ? 'PADAWAN' : lifetimeGoons < 10000 ? 'GOON MASTER' : 'GALACTIC MENACE';

  return <main className="game-shell">
    <div className="space-dust" />
    <header>
      <div className="brand"><span className="brand-icon">G</span><span><b>GOON <em>WARS</em></b><small>THE MATH STRIKES BACK</small></span></div>
      <div className="headline"><i /> BATTLE ONLINE <strong>{rank}</strong></div>
      <div className="header-actions"><button className="math-launch" onClick={openMultiplication}>MULTIPLY <b>+350 G</b></button><button className="sudoku-launch" onClick={openSudoku}>SUDOKU <b>UP TO +900 G</b></button><button className="sound-toggle" onClick={() => setSoundOn(value => !value)} aria-label="Toggle click sound">{soundOn ? 'VOICE ON' : 'VOICE OFF'}</button><div className="mini-stat"><span>MANUAL GOONS</span><b>{compact(manualGoons)}</b></div></div>
    </header>

    <div className="resource-bar">
      <div><span>GOON RESERVES</span><strong>{compact(goons)}</strong></div>
      <div className="main-count"><span>TOTAL GOONS RECRUITED</span><strong>{compact(lifetimeGoons)}</strong></div>
      <div><span>GOONS PER SECOND</span><strong>{gps.toFixed(gps < 10 ? 1 : 0)}</strong></div>
    </div>

    <div className="layout">
      <aside className="shop panel">
        <div className="panel-title"><span>GOON FACTORIES</span><small>COOKIE-CLICKER STYLE</small></div>
        {buildings.map(item => {
          const cost = buildingPrice(item);
          return <button key={item.id} className="shop-item" disabled={goons < cost} onClick={() => buyBuilding(item)}>
            <span className="item-icon">{item.icon}</span>
            <span className="item-copy"><b>{item.name}</b><small>{item.note}</small><em>+{item.gps} goons/sec</em></span>
            <span className="price"><b>{owned[item.id]}</b><small>{compact(cost)} G</small></span>
          </button>;
        })}
      </aside>

      <section className="battlefield">
        <img className="arena-backdrop" src={`${import.meta.env.BASE_URL}moon-goon-arena.png`} alt="Moonlit arena with the supplied gorilla and wooden bat character facing each other" />
        <div className="fighter-labels"><b>GORILLA GOON</b><span>MOON ARENA</span><b>BAT GOON</b></div>
        <div className="equation equation-a">x² + y² = 🚀</div>
        <div className="equation equation-b">∫ DINO dx</div>
        <img className="dinosaur-squad" src={`${import.meta.env.BASE_URL}laser-dinosaurs.png`} alt="Realistic Tyrannosaurus and Triceratops firing lasers" />
        <div className="laser laser-left"><i /></div>
        <div className="laser laser-right"><i /></div>
        <div className="math-callout callout-left">7 × 8 = 56 // FIRE</div>
        <div className="math-callout callout-right">π ≈ 3.14159 // FIRE</div>
        <button className="rival-button" onClick={recruit} aria-label="Click the right-side person to recruit one goon">
          <span className="target-ring" />
          <img src={`${import.meta.env.BASE_URL}right-side-rival.png`} alt="The person from the right side of the supplied photo" draggable="false" />
          {particles.map(item => <i className="goon-pop" key={item.id} style={{ left: item.x, top: item.y }}>+{clickPower} GOON{clickPower === 1 ? '' : 'S'}</i>)}
        </button>
        <div className="mission"><span>{toast}</span><b>CLICK POWER · {clickPower} GOON{clickPower === 1 ? '' : 'S'}</b><small>Power-ups make every hit stronger.</small></div>
        <div className="battle-meter"><span>GALACTIC MATH BATTLE</span><div><i style={{ width: `${Math.min(100, battle % 101)}%` }} /></div></div>
      </section>

      <aside className="upgrades panel">
        <div className="panel-title"><span>FORCE UPGRADES</span><small>PERMANENT MULTIPLIERS</small></div>
        {upgrades.map(item => {
          const bought = boughtUpgrades.includes(item.id);
          return <button key={item.id} className={`upgrade-item ${bought ? 'bought' : ''}`} disabled={bought || goons < item.cost} onClick={() => buyUpgrade(item)}>
            <span className={`power-art ${item.art}`} aria-hidden="true"><i/><b/></span><p><b>{item.name}</b><small>{item.note}</small></p><em>{bought ? 'OWNED' : `${compact(item.cost)} G`}</em>
          </button>;
        })}
        <div className="intel-card"><b>POWER READOUT</b><span>Manual goons</span><strong>×{power.click}</strong><span>Factory output</span><strong>×{power.auto}</strong><span>Autosave</span><strong>ONLINE</strong></div>
        <div className="rules"><b>HOW TO GOON</b><p>Click the rival to recruit goons. Stronger arms boost manual hits; dinosaurs and factories keep producing while you’re away.</p></div>
      </aside>
    </div>
    <div className={`sudoku-backdrop ${sudokuOpen ? 'open' : ''}`} onClick={() => setSudokuOpen(false)} />
    <aside className={`sudoku-drawer ${sudokuOpen ? 'open' : ''}`} aria-hidden={!sudokuOpen}>
      <button className="sudoku-close" onClick={() => setSudokuOpen(false)} aria-label="Close Sudoku">×</button>
      <span className="drawer-kicker">MIND TRIAL · {currentSudokuLevel.label} · PUZZLE {sudokuIndex + 1}</span><h2>GOON <em>SUDOKU</em></h2>
      <div className="difficulty-tabs">{Object.entries(sudokuLevels).map(([key, level]) => <button key={key} className={sudokuDifficulty === key ? 'active' : ''} onClick={() => chooseSudokuDifficulty(key)}><b>{level.label}</b><small>+{level.reward} G</small></button>)}</div>
      <p>{sudokuStatus}</p>
      <div className="sudoku-grid">{sudokuValues.map((value, index) => <input key={`${sudokuIndex}-${index}`} value={value} readOnly={Boolean(currentSudokuPuzzle[index])} className={currentSudokuPuzzle[index] ? 'given' : ''} onChange={event => updateSudoku(index, event.target.value)} inputMode="numeric" maxLength="1" aria-label={`Sudoku row ${Math.floor(index / 9) + 1} column ${(index % 9) + 1}`} />)}</div>
      <div className="sudoku-actions"><button disabled={sudokuTransitioning} onClick={resetSudoku}>RESET</button><button disabled={sudokuTransitioning} className="check" onClick={checkSudoku}>{sudokuTransitioning ? 'NEXT PUZZLE…' : 'CHECK GRID'}</button></div>
      <small>Each row, column, and 3×3 sector needs the numbers 1–9.</small>
    </aside>
    <div className={`math-backdrop ${mathOpen ? 'open' : ''}`} onClick={() => setMathOpen(false)} />
    <aside className={`math-drawer ${mathOpen ? 'open' : ''}`} aria-hidden={!mathOpen}>
      <button className="math-close" onClick={() => setMathOpen(false)} aria-label="Close multiplication challenge">×</button>
      <span className="drawer-kicker">GOON ACADEMY · MULTIPLICATION LAB</span>
      <h2>LASER <em>MATH</em></h2>
      <div className="math-tabs">{Object.entries(multiplicationModes).map(([key, mode]) => <button key={key} className={mathMode === key ? 'active' : ''} onClick={() => chooseMathMode(key)}><b>{mode.label}</b><small>+{mode.reward} G</small></button>)}</div>
      <p>{mathStatus}</p>
      <div className="math-card">
        <span>CALCULATE</span>
        <strong>{mathProblem.left} × {mathProblem.right}</strong>
        <label htmlFor="math-answer">YOUR ANSWER</label>
        <input id="math-answer" value={mathAnswer} onChange={event => /^\d*$/.test(event.target.value) && setMathAnswer(event.target.value)} onKeyDown={event => event.key === 'Enter' && checkMultiplication()} inputMode="numeric" autoComplete="off" placeholder="?" />
        <button onClick={checkMultiplication}>FIRE ANSWER</button>
      </div>
      <small>A fresh multiplication appears after every correct answer.</small>
    </aside>
    <footer><span>GOON WARS // SECTOR 66</span><span>MAY THE MATH BE WITH YOU</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
