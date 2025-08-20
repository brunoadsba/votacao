import { viableIdeas, disruptiveIdeas } from './data/ideas.js?v=4';

function aggregateVotes(submissions) {
    const allVotes = {};
    Object.values(submissions || {}).forEach((entry) => {
        if (entry && entry.votes) {
            Object.entries(entry.votes).forEach(([ideaId, rating]) => {
                if (!allVotes[ideaId]) allVotes[ideaId] = [];
                allVotes[ideaId].push(Number(rating) || 0);
            });
        }
    });
    return allVotes;
}

function computeRanking(ideas, votesMap) {
    return ideas.map((idea) => {
        const list = votesMap[idea.id] || [];
        const total = list.reduce((a, b) => a + b, 0);
        const avg = list.length ? total / list.length : 0;
        return { ...idea, total, avg, count: list.length };
    }).sort((a, b) => b.total - a.total);
}

function renderRanking(containerId, items, accent) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map((item, idx) => `
        <div class="flex items-center justify-between p-3 rounded border mb-2 bg-${accent}-50">
            <div class="flex items-center gap-3">
                <span class="text-${accent}-700 font-bold">${idx + 1}º</span>
                <span class="font-medium">${item.title}</span>
            </div>
            <div class="text-${accent}-800 font-semibold">${item.total} pts</div>
        </div>
    `).join('');
}

function renderMeta(countParticipants, lastUpdated) {
    const meta = document.getElementById('meta');
    if (!meta) return;
    meta.textContent = `Participantes com envio: ${countParticipants} • Última atualização: ${new Date(lastUpdated).toLocaleTimeString()}`;
}

async function init() {
    const { subscribeSubmissions } = await import('./services/persistence.js?v=4');
    const unsubscribe = await subscribeSubmissions((submissions) => {
        const codesWithData = Object.keys(submissions || {});
        const votesMap = aggregateVotes(submissions);
        const viable = computeRanking(viableIdeas, votesMap);
        const disruptive = computeRanking(disruptiveIdeas, votesMap);
        renderRanking('rank-viable', viable, 'yellow');
        renderRanking('rank-disruptive', disruptive, 'purple');
        renderMeta(codesWithData.length, Date.now());
    });

    window.__dashboard_unsubscribe = unsubscribe;
}

document.addEventListener('DOMContentLoaded', init);


