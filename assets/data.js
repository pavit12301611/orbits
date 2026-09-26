/* Orbit 2.0 — core data: subjects, 50 chapters, formulas, planner templates.
   No sign-in, no network, no tracking. Everything runs locally. */
const SUBJECTS = {
  Physics:    {icon:'atom',  color:'physics',     tagline:'Understand the world, one concept at a time.'},
  Chemistry:  {icon:'flask', color:'chemistry',   tagline:'Build a strong bond with the fundamentals.'},
  Biology:    {icon:'leaf',  color:'biology',     tagline:'Explore the science of life, chapter by chapter.'},
  Mathematics:{icon:'math',  color:'mathematics', tagline:'Find the logic behind every problem.'}
};
const TRACKS = {NEET:['Physics','Chemistry','Biology'], JEE:['Physics','Chemistry','Mathematics']};
/* 50 chapters. id is stable. wt = exam weight 1-3. */
const CHAPTERS = [
 // Physics (12)
 {id:'P01',subject:'Physics',name:'Motion in a Straight Line',wt:3,blurb:'Position, velocity, acceleration and the equations of motion.'},
 {id:'P02',subject:'Physics',name:'Laws of Motion',wt:3,blurb:'Newton’s laws, friction, and connected bodies.'},
 {id:'P03',subject:'Physics',name:'Work, Energy and Power',wt:3,blurb:'Work–energy theorem, conservation and collisions.'},
 {id:'P04',subject:'Physics',name:'Motion in a Plane & Rotation',wt:3,blurb:'Projectiles, circular motion, torque and angular momentum.'},
 {id:'P05',subject:'Physics',name:'Gravitation',wt:2,blurb:'Kepler’s laws, g-variation, satellites and escape speed.'},
 {id:'P06',subject:'Physics',name:'Oscillations & Waves',wt:2,blurb:'SHM, pendulums, sound and wave optics basics.'},
 {id:'P07',subject:'Physics',name:'Thermodynamics',wt:3,blurb:'Laws of thermodynamics, processes and heat engines.'},
 {id:'P08',subject:'Physics',name:'Electrostatics',wt:3,blurb:'Coulomb’s law, field, potential and capacitors.'},
 {id:'P09',subject:'Physics',name:'Current Electricity',wt:3,blurb:'Ohm’s law, circuits, Kirchhoff and meters.'},
 {id:'P10',subject:'Physics',name:'Magnetism & EMI',wt:2,blurb:'Magnetic effects, EMI, AC and transformers.'},
 {id:'P11',subject:'Physics',name:'Optics',wt:3,blurb:'Mirrors, lenses, interference, diffraction, polarisation.'},
 {id:'P12',subject:'Physics',name:'Modern Physics',wt:3,blurb:'Photoelectric effect, atoms, nuclei and radioactivity.'},
 // Chemistry (12)
 {id:'C01',subject:'Chemistry',name:'Mole Concept & Solutions',wt:3,blurb:'Moles, concentration terms and colligative properties.'},
 {id:'C02',subject:'Chemistry',name:'Structure of Atom',wt:2,blurb:'Quantum numbers, orbitals and electronic configuration.'},
 {id:'C03',subject:'Chemistry',name:'Periodic Classification',wt:2,blurb:'Trends in size, ionisation energy and electronegativity.'},
 {id:'C04',subject:'Chemistry',name:'Chemical Bonding',wt:3,blurb:'Ionic, covalent, VSEPR, hybridisation and MOT basics.'},
 {id:'C05',subject:'Chemistry',name:'Thermodynamics',wt:3,blurb:'Enthalpy, entropy, Gibbs energy and spontaneity.'},
 {id:'C06',subject:'Chemistry',name:'Equilibrium',wt:3,blurb:'Chemical and ionic equilibrium, pH and buffers.'},
 {id:'C07',subject:'Chemistry',name:'Redox & Electrochemistry',wt:3,blurb:'Oxidation states, cells, Nernst equation, Faraday’s laws.'},
 {id:'C08',subject:'Chemistry',name:'Chemical Kinetics',wt:2,blurb:'Rate laws, order, half-life and Arrhenius equation.'},
 {id:'C09',subject:'Chemistry',name:'s & p Block Elements',wt:2,blurb:'Groups 1, 2, 13–18: trends and key compounds.'},
 {id:'C10',subject:'Chemistry',name:'d & f Block Elements',wt:2,blurb:'Transition metals, colour, magnetism and coordination basics.'},
 {id:'C11',subject:'Chemistry',name:'Organic Basics & Hydrocarbons',wt:3,blurb:'GOC, isomerism, alkanes, alkenes, alkynes, benzene.'},
 {id:'C12',subject:'Chemistry',name:'Oxygen & Nitrogen Organics',wt:3,blurb:'Alcohols, aldehydes, acids, amines and biomolecules.'},
 // Biology (14)
 {id:'B01',subject:'Biology',name:'Cell: The Unit of Life',wt:3,blurb:'Cell organelles, plant vs animal cells.'},
 {id:'B02',subject:'Biology',name:'Biomolecules',wt:2,blurb:'Carbs, proteins, lipids, nucleic acids and enzymes.'},
 {id:'B03',subject:'Biology',name:'Cell Cycle and Division',wt:3,blurb:'Mitosis, meiosis and their significance.'},
 {id:'B04',subject:'Biology',name:'Photosynthesis',wt:3,blurb:'Light reactions, Calvin cycle, C3/C4/CAM.'},
 {id:'B05',subject:'Biology',name:'Breathing & Respiration',wt:2,blurb:'Breathing mechanism, transport of gases, cellular respiration.'},
 {id:'B06',subject:'Biology',name:'Body Fluids and Circulation',wt:3,blurb:'Blood, heart, cardiac cycle and circulation.'},
 {id:'B07',subject:'Biology',name:'Excretory Products',wt:2,blurb:'Kidney, nephron, urine formation.'},
 {id:'B08',subject:'Biology',name:'Neural Control',wt:2,blurb:'Neuron, synapse, brain and reflex action.'},
 {id:'B09',subject:'Biology',name:'Chemical Coordination',wt:2,blurb:'Endocrine glands and their hormones.'},
 {id:'B10',subject:'Biology',name:'Human Reproduction',wt:3,blurb:'Gametogenesis, fertilisation, pregnancy and lactation.'},
 {id:'B11',subject:'Biology',name:'Plant Anatomy & Reproduction',wt:2,blurb:'Tissues, flower, pollination and double fertilisation.'},
 {id:'B12',subject:'Biology',name:'Principles of Inheritance',wt:3,blurb:'Mendel’s laws, linkage, sex determination.'},
 {id:'B13',subject:'Biology',name:'Molecular Basis of Inheritance',wt:3,blurb:'DNA, replication, transcription, translation, lac operon.'},
 {id:'B14',subject:'Biology',name:'Evolution & Ecology',wt:3,blurb:'Origin of life, natural selection, populations, ecosystems.'},
 // Mathematics (12)
 {id:'M01',subject:'Mathematics',name:'Quadratic Equations',wt:2,blurb:'Roots, discriminant, nature and formation of equations.'},
 {id:'M02',subject:'Mathematics',name:'Complex Numbers',wt:2,blurb:'Modulus, argument, De Moivre and cube roots of unity.'},
 {id:'M03',subject:'Mathematics',name:'P&C and Binomial Theorem',wt:3,blurb:'Counting, arrangements and binomial expansions.'},
 {id:'M04',subject:'Mathematics',name:'Sequences and Series',wt:2,blurb:'AP, GP, HP and special sums.'},
 {id:'M05',subject:'Mathematics',name:'Trigonometry',wt:3,blurb:'Identities, equations, properties of triangles.'},
 {id:'M06',subject:'Mathematics',name:'Coordinate Geometry',wt:3,blurb:'Lines, circles, parabola, ellipse, hyperbola.'},
 {id:'M07',subject:'Mathematics',name:'Limits and Continuity',wt:2,blurb:'Standard limits, continuity and differentiability.'},
 {id:'M08',subject:'Mathematics',name:'Differentiation',wt:3,blurb:'Rules, chain rule, tangents, maxima–minima.'},
 {id:'M09',subject:'Mathematics',name:'Integrals',wt:3,blurb:'Indefinite and definite integrals, area under curves.'},
 {id:'M10',subject:'Mathematics',name:'Matrices and Determinants',wt:2,blurb:'Operations, inverse, system of equations.'},
 {id:'M11',subject:'Mathematics',name:'Vectors & 3D Geometry',wt:2,blurb:'Dot/cross products, lines and planes in space.'},
 {id:'M12',subject:'Mathematics',name:'Probability',wt:3,blurb:'Classical, conditional, Bayes and distributions basics.'}
];
const chapterByName = (subject,name)=>CHAPTERS.find(c=>c.subject===subject&&c.name===name);
const chapterById = (id)=>CHAPTERS.find(c=>c.id===id);
/* Question bank lives in bank-*.js files. Shape per entry:
   [question, [correct, wrong1, wrong2, wrong3], explanation, chapterName, difficulty 1-3] */
const BANK = {Physics:[],Chemistry:[],Biology:[],Mathematics:[]};
/* Study guides live in guides-*.js. Shape:
   {id, subject, chapter, title, time, topic, intro, sections[[h,p]..], formula, example, tips[3], trap} */
const MATERIALS = [];
const FORMULAS = {
 Physics:[
  ['Kinematics (constant a)','v = u + at · s = ut + ½at² · v² = u² + 2as','Signs follow your chosen positive direction.'],
  ['Projectile range','R = u² sin2θ / g · H = u² sin²θ / 2g · T = 2u sinθ / g','Max range at 45° on level ground.'],
  ['Newton II + friction','F = ma · fₛ ≤ μₛN · fₖ = μₖN','Static friction adjusts up to its limit.'],
  ['Work–energy','W = F·s = ΔK · K = ½mv² · U = mgh','Net work = change in kinetic energy.'],
  ['Circular motion','a_c = v²/r = ω²r · F_c = mv²/r','Centripetal force does zero work.'],
  ['Rotation','τ = r×F = Iα · L = Iω · K_rot = ½Iω²','L is conserved when net external τ = 0.'],
  ['Gravitation','F = Gm₁m₂/r² · g = GM/R² · v_esc = √(2GM/R)','g falls with height and depth.'],
  ['SHM','x = A sin(ωt+φ) · T = 2π√(m/k) · T_pend = 2π√(L/g)','a = −ω²x always points to mean position.'],
  ['Thermodynamics','ΔU = Q − W · W_isobaric = PΔV · η = 1 − T_c/T_h','Sign convention: W by the system.'],
  ['Electrostatics','F = kq₁q₂/r² · E = kQ/r² · V = kQ/r · C = Q/V','Field points away from + charge.'],
  ['Current','V = IR · P = VI · series: R add · parallel: 1/R add','ρ depends on material and temperature.'],
  ['Optics','1/f = 1/v − 1/u · P = 1/f(m) · μ = sin i / sin r','Sign convention must stay consistent.'],
  ['Modern','E = hν = hc/λ · K_max = hν − φ₀ · N = N₀(1/2)^(t/T½)','Photoemission is instantaneous above threshold.']
 ],
 Chemistry:[
  ['Mole & concentration','n = m/M · M = n/V(L) · N = n·Nₐ','Convert mL → L before molarity.'],
  ['Atomic structure','Eₙ = −13.6 Z²/n² eV · λ = h/mv','Lyman n→1 is UV; Balmer n→2 is visible.'],
  ['Equilibrium','Kc = [C]^c[D]^d/[A]^a[B]^b · ΔG° = −RT ln K','Pure solids/liquids are omitted from K.'],
  ['pH (25 °C)','pH = −log[H⁺] · pH + pOH = 14 · Kw = 10⁻¹⁴','Strong acid: [H⁺] ≈ acid concentration.'],
  ['Thermochemistry','ΔG = ΔH − TΔS · ΔH°_rxn = ΣΔH°f(prod) − ΣΔH°f(react)','Spontaneous when ΔG < 0.'],
  ['Electrochemistry','E°cell = E°cath − E°an · ΔG° = −nFE° · W = ZQ','Reduction happens at the cathode.'],
  ['Nernst (25 °C)','E = E° − (0.0591/n) log Q','Q uses the same form as K.'],
  ['Kinetics 1st order','t½ = 0.693/k · k = (2.303/t) log([A]₀/[A])','Half-life is concentration-independent.'],
  ['Arrhenius','k = Ae^(−Ea/RT)','Catalyst lowers Ea, never changes K or ΔH.'],
  ['Solutions','ΔTf = i·Kf·m · π = iCRT','van’t Hoff factor i counts particles.'],
  ['Bond order (MOT)','BO = (Nb − Na)/2','Higher BO → shorter, stronger bond.'],
  ['Hybridisation','sp:180° · sp²:120° · sp³:109.5°','Count σ-domains + lone pairs on central atom.']
 ],
 Biology:[
  ['Cell energy','Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂','O₂ released comes from water, not CO₂.'],
  ['Respiration','C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP','Most ATP forms in mitochondria.'],
  ['Mendel ratios','Mono: 3:1 (pheno) · 1:2:1 (geno) · Di: 9:3:3:1','Test cross: unknown × homozygous recessive.'],
  ['DNA base pairing','A=T (2 H-bonds) · G≡C (3 H-bonds)','Chargaff: A+G = T+C.'],
  ['Central dogma','DNA → RNA → Protein','Reverse transcription needs reverse transcriptase.'],
  ['Cardiac cycle','0.8 s: atrial 0.1 · ventricular 0.3 · joint diastole 0.4','Lubb = AV valves close; Dubb = semilunar close.'],
  ['Nephron flow','Glomerulus → PCT → Loop of Henle → DCT → Collecting duct','ADH acts on DCT/collecting duct.'],
  ['Hormone pairs','Insulin ↓ glucose · Glucagon ↑ glucose','PTH ↑ Ca²⁺ · Calcitonin ↓ Ca²⁺.'],
  ['Brain map','Cerebrum: thought · Cerebellum: balance · Medulla: involuntary','Hypothalamus: hunger, thirst, temperature.'],
  ['Plant hormones','Auxin: elongation · Gibberellin: bolting · Cytokinin: division · ABA: dormancy','Ethylene: fruit ripening.'],
  ['Ecology 10% law','Only ~10% energy transfers per trophic level','Biomass pyramid of the sea can invert.'],
  ['Double fertilisation','Syngamy (2n zygote) + triple fusion (3n endosperm)','Unique to angiosperms.']
 ],
 Mathematics:[
  ['Quadratic','x = (−b ± √(b²−4ac))/2a · sum = −b/a · product = c/a','D > 0 real distinct · D = 0 equal · D < 0 complex.'],
  ['Complex','|a+ib| = √(a²+b²) · i²=−1 · ω³=1, 1+ω+ω²=0','|z₁z₂| = |z₁||z₂|.'],
  ['AP / GP','AP: aₙ=a+(n−1)d, Sₙ=n/2(2a+(n−1)d) · GP: Sₙ=a(rⁿ−1)/(r−1)','GP infinite: S = a/(1−r), |r|<1.'],
  ['Binomial','(a+b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳbʳ · middle term for even n: T_{n/2+1}','ⁿCᵣ = ⁿCₙ₋ᵣ.'],
  ['Trig identities','sin²θ+cos²θ=1 · 1+tan²θ=sec²θ · sin2θ=2sinθcosθ','Allied angles: ASTC (All-Sin-Tan-Cos).'],
  ['Straight line','y=mx+c · m=−a/b for ax+by+c=0 · d=|ax₁+by₁+c|/√(a²+b²)','Parallel: equal slopes · Perpendicular: m₁m₂=−1.'],
  ['Circle','(x−h)²+(y−k)²=r² · centre (−g,−f), r=√(g²+f²−c)','Tangent ⟂ radius at contact.'],
  ['Limits','lim sinx/x=1 · lim (1+1/n)ⁿ=e · lim (eˣ−1)/x=1','Trig limits need radians.'],
  ['Derivatives','(xⁿ)′=nxⁿ⁻¹ · (uv)′=u′v+uv′ · chain: dy/dx=dy/du·du/dx','Maxima: f′=0 and f″<0.'],
  ['Integrals','∫xⁿdx=xⁿ⁺¹/(n+1) · ∫dx/x=ln|x| · ∫eˣ=eˣ','Definite: F(b)−F(a); area uses |f|.'],
  ['Matrices','|AB|=|A||B| · A⁻¹=adj(A)/|A| · 2×2: ad−bc','Singular when |A|=0.'],
  ['Probability','P(A∪B)=P(A)+P(B)−P(A∩B) · P(A|B)=P(A∩B)/P(B)','Independent: P(A∩B)=P(A)P(B).']
 ]
};
const TEMPLATES = [
 {id:'neet7', name:'NEET 7-day sprint', track:'NEET', desc:'High-weight chapters, one mock, daily revision.',
  tasks:[[0,'Physics','Kinematics: 1 guide + Learn combo'],[0,'Chemistry','Mole concept: Drill combo'],[0,'Biology','Cell: Learn + flashcards'],[1,'Physics','Laws of Motion: Drill combo'],[1,'Chemistry','Chemical Bonding: Learn combo'],[1,'Biology','Genetics I: Learn combo'],[2,'Physics','Current Electricity: Drill'],[2,'Chemistry','Equilibrium: Drill'],[2,'Biology','Human Physiology: pick 1 guide'],[3,'Physics','Optics: Learn combo'],[3,'Chemistry','GOC + Hydrocarbons: Learn'],[3,'Biology','Molecular Inheritance: Learn'],[4,'Physics','Modern Physics: Sprint'],[4,'Chemistry','Electrochemistry: Drill'],[4,'Biology','Ecology: Sprint'],[5,'General revision','Mistake Fixer: clear your mistake bank'],[5,'General revision','Flashcards: all due cards'],[6,'General revision','NEET full mock (45 Q) + review']]},
 {id:'jee7', name:'JEE 7-day sprint', track:'JEE', desc:'Concept + speed mix with a full JEE mock at the end.',
  tasks:[[0,'Physics','Kinematics: Learn + Sprint'],[0,'Chemistry','Mole + Atomic: Drill'],[0,'Mathematics','Quadratic + Complex: Learn'],[1,'Physics','WEP + Rotation: Drill'],[1,'Chemistry','Bonding: Drill'],[1,'Mathematics','P&C + Binomial: Drill'],[2,'Physics','Electrostatics + Current: Drill'],[2,'Chemistry','Thermo + Equilibrium: Drill'],[2,'Mathematics','Calculus: Limits + Differentiation'],[3,'Physics','Magnetism + Optics: Learn'],[3,'Chemistry','Kinetics + Electrochem: Drill'],[3,'Mathematics','Integrals: Learn'],[4,'Physics','Modern Physics: Sprint'],[4,'Chemistry','Organic: GOC + O/N organics'],[4,'Mathematics','Vectors + Probability: Sprint'],[5,'General revision','Mistake Fixer + due flashcards'],[6,'General revision','JEE full mock (30 Q) + review']]},
 {id:'rev7', name:'Revision week (any track)', track:'ANY', desc:'Light days, heavy recall. Best before a test.',
  tasks:[[0,'General revision','Flashcards: 30 due cards'],[0,'General revision',' weakest chapter: Learn combo'],[1,'General revision','3 Sprint combos back-to-back'],[1,'General revision','Formula sheet: 1 subject, loud recall'],[2,'General revision','Mistake Fixer until bank is empty'],[2,'General revision','Re-read 2 bookmarked guides'],[3,'General revision','Timed Drill: 2 chapters'],[3,'General revision','25-min focus × 2'],[4,'General revision','Flashcards: all due'],[4,'General revision','Sprint your 3 weakest chapters'],[5,'General revision','Full mock + full review'],[6,'General revision','Rest + light formula revision']]}
];
const QUOTES = [
 ['Small steps every day.','Consistency beats intensity.'],
 ['You don’t need motivation.','You need a plan and a timer.'],
 ['Mistakes are data.','Review them and they pay interest.'],
 ['Teach it to learn it.','Explain each answer out loud.'],
 ['Slow is smooth, smooth is fast.','Accuracy first, speed follows.'],
 ['Your future self is watching.','Give them something to thank you for.'],
 ['One chapter. One combo.','Then the next. That’s the whole secret.'],
 ['Tired? Do 10 minutes.','Starting is the hardest part.']
];
