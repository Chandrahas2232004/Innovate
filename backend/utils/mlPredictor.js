// Lightweight logistic regression trained on synthetic data (no external deps)
// Features used: category, requiredFunding, targetAudience length, author location
// The model is trained at module load and cached for reuse. If a saved model exists, it is loaded.

import fs from 'fs';
import path from 'path';

// -------------------------- Utilities --------------------------
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Normalize a positive numeric value via log scaling to keep ranges stable
const logNormalize = (x) => Math.log(1 + Math.max(0, Number(x) || 0)) / Math.log(1 + 1e6); // assume up to ~1M

// One-hot encoders for categories and locations (extendable)
const CATEGORY_VALUES = ['agriculture', 'education', 'healthcare', 'technology', 'infrastructure', 'other'];
const LOCATION_VALUES = ['urban', 'suburban', 'rural', 'coastal', 'inland', 'unknown'];

const oneHot = (value, values) => {
	const idx = values.indexOf((value || '').toLowerCase());
	return values.map((_, i) => (i === (idx >= 0 ? idx : values.length - 1) ? 1 : 0));
};

// Build feature vector from input fields
function buildFeatures(input) {
	const categoryOneHot = oneHot(input.category, CATEGORY_VALUES);
	const locationOneHot = oneHot(input.authorLocation, LOCATION_VALUES);
	const funding = logNormalize(input.requiredFunding);
	const audienceLen = Math.min(1, ((input.targetAudience || '').length || 0) / 200); // cap length effect
	return [...categoryOneHot, funding, audienceLen, ...locationOneHot];
}

// -------------------- Synthetic dataset generation --------------------
// We generate labels with an underlying rule, add noise, then train to approximate it.
function generateSyntheticDataset(numSamples = 1200, seed = 42) {
	let rand = mulberry32(seed);
	const X = [];
	const y = [];
	const rawRows = [];
	for (let i = 0; i < numSamples; i++) {
		const category = CATEGORY_VALUES[Math.floor(rand() * CATEGORY_VALUES.length)];
		const authorLocation = LOCATION_VALUES[Math.floor(rand() * LOCATION_VALUES.length)];
		const requiredFunding = Math.floor(rand() * 300000); // 0..300k
		const targetAudience = randomAudience(rand);

		const featuresInput = { category, authorLocation, requiredFunding, targetAudience };
		const feats = buildFeatures(featuresInput);

		// Hidden rule: category/tech favoured, funding penalized, longer audience text helps, urban/suburban slight boost
		let base = 0.0;
		base += categoryBase(category);
		base -= (requiredFunding / 300000) * 1.2; // stronger penalty when near 300k
		base += Math.min(1, (targetAudience.length / 200)) * 0.6;
		base += locationBase(authorLocation);
		// add small noise
		base += (rand() - 0.5) * 0.3;
		const prob = sigmoid(base);
		const label = prob > 0.5 ? 1 : 0;
		X.push(feats);
		y.push(label);
		rawRows.push({ category, authorLocation, requiredFunding, targetAudience, success: label });
	}
	return { X, y, rawRows };
}

function categoryBase(category) {
	switch ((category || '').toLowerCase()) {
		case 'technology': return 1.0;
		case 'healthcare': return 0.8;
		case 'education': return 0.6;
		case 'infrastructure': return 0.4;
		case 'agriculture': return 0.5;
		default: return 0.3;
	}
}

function locationBase(loc) {
	switch ((loc || '').toLowerCase()) {
		case 'urban': return 0.5;
		case 'suburban': return 0.35;
		case 'coastal': return 0.3;
		case 'inland': return 0.15;
		case 'rural': return 0.1;
		default: return 0.0;
	}
}

function randomAudience(rand) {
	const lengths = [20, 60, 120, 180];
	const len = lengths[Math.floor(rand() * lengths.length)];
	const words = ['youth','farmers','smes','patients','developers','teachers','commuters','tourists','parents','seniors'];
	let s = [];
	for (let i = 0; i < Math.floor(len / 6); i++) s.push(words[Math.floor(rand() * words.length)]);
	return s.join(' ');
}

// Simple deterministic PRNG
function mulberry32(a) {
	return function() {
		var t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}

// ------------------------ Logistic Regression ------------------------
class LogisticRegression {
	constructor(nFeatures) {
		this.weights = new Array(nFeatures).fill(0);
		this.bias = 0;
	}

	predictProba(x) {
		let z = this.bias;
		for (let i = 0; i < this.weights.length; i++) z += this.weights[i] * x[i];
		return sigmoid(z);
	}

	train(X, y, { learningRate = 0.3, epochs = 300 } = {}) {
		const n = X.length;
		for (let epoch = 0; epoch < epochs; epoch++) {
			let gradW = new Array(this.weights.length).fill(0);
			let gradB = 0;
			for (let i = 0; i < n; i++) {
				const p = this.predictProba(X[i]);
				const error = p - y[i];
				for (let j = 0; j < this.weights.length; j++) gradW[j] += error * X[i][j];
				gradB += error;
			}
			for (let j = 0; j < this.weights.length; j++) this.weights[j] -= (learningRate / n) * gradW[j];
			this.bias -= (learningRate / n) * gradB;
		}
	}
}

// ------------------------ Persistence Helpers ------------------------
const ML_DIR = path.resolve(process.cwd(), '..', 'ml');
const MODEL_PATH = path.join(ML_DIR, 'trained_logreg.json');
const CSV_PATH = path.join(ML_DIR, 'synthetic_training_data.csv');

function ensureMlDir() {
	if (!fs.existsSync(ML_DIR)) fs.mkdirSync(ML_DIR, { recursive: true });
}

function saveModel(modelInstance) {
	ensureMlDir();
	const payload = {
		weights: modelInstance.weights,
		bias: modelInstance.bias,
		featureOrder: {
			CATEGORY_VALUES,
			LOCATION_VALUES,
			funding: 'logNormalize',
			audienceLength: '0..1 by /200 cap'
		}
	};
	fs.writeFileSync(MODEL_PATH, JSON.stringify(payload, null, 2), 'utf8');
}

function loadModel(modelInstance) {
	if (!fs.existsSync(MODEL_PATH)) return false;
	const raw = fs.readFileSync(MODEL_PATH, 'utf8');
	const data = JSON.parse(raw);
	if (!Array.isArray(data.weights) || typeof data.bias !== 'number') return false;
	if (data.weights.length !== modelInstance.weights.length) return false;
	modelInstance.weights = data.weights;
	modelInstance.bias = data.bias;
	return true;
}

function saveCsv(rows) {
	ensureMlDir();
	const headers = ['category','authorLocation','requiredFunding','targetAudience','success'];
	const lines = [headers.join(',')];
	for (const r of rows) {
		const safeAudience = (r.targetAudience || '').replace(/\"/g, '""');
		const maybeQuoted = safeAudience.includes(',') ? `"${safeAudience}"` : safeAudience;
		lines.push([
			r.category,
			r.authorLocation,
			r.requiredFunding,
			maybeQuoted,
			r.success
		].join(','));
	}
	fs.writeFileSync(CSV_PATH, lines.join('\n'), 'utf8');
}

// ------------------------ Train/Load at startup ------------------------
const featureDim = CATEGORY_VALUES.length + 1 /*funding*/ + 1 /*audience len*/ + LOCATION_VALUES.length;
const model = new LogisticRegression(featureDim);
(function initModel() {
	const loaded = loadModel(model);
	if (loaded) return; // use persisted weights
	const { X, y, rawRows } = generateSyntheticDataset(1500, 123);
	model.train(X, y, { learningRate: 0.5, epochs: 500 });
	saveModel(model);
	saveCsv(rawRows);
})();

// ------------------------ Public API ------------------------
export const predictSuccessRate = async (ideaOrInput) => {
	const input = normalizeInput(ideaOrInput);
	const x = buildFeatures(input);
	const prob = model.predictProba(x);
	// Return probability for realistic values in [0,1]
	return clamp01(prob);
};

export const getSuccessRateExplanation = (ideaOrInput) => {
	const input = normalizeInput(ideaOrInput);
	const x = buildFeatures(input);
	const contributions = perFeatureContributions(x, model.weights, model.bias);
	return {
		probability: clamp01(model.predictProba(x)),
		features: contributions,
		modelPath: MODEL_PATH,
		csvPath: CSV_PATH
	};
};

function normalizeInput(idea) {
	return {
		category: idea.category,
		requiredFunding: idea.requiredFunding,
		targetAudience: idea.targetAudience,
		authorLocation: idea.authorLocation || idea.location || 'unknown'
	};
}

function perFeatureContributions(x, w, b) {
	// Return human-readable mapping of contributions
	const parts = [];
	let index = 0;
	for (let i = 0; i < CATEGORY_VALUES.length; i++, index++) {
		if (x[index] === 1) parts.push({ feature: `category:${CATEGORY_VALUES[i]}`, weight: w[index] });
	}
	const fundingIdx = index; index++;
	parts.push({ feature: 'requiredFunding(log-normalized)', weight: w[fundingIdx], value: x[fundingIdx] });
	const audienceIdx = index; index++;
	parts.push({ feature: 'targetAudienceLength(norm)', weight: w[audienceIdx], value: x[audienceIdx] });
	for (let i = 0; i < LOCATION_VALUES.length; i++, index++) {
		if (x[index] === 1) parts.push({ feature: `authorLocation:${LOCATION_VALUES[i]}`, weight: w[index] });
	}
	return { bias: b, terms: parts };
}



