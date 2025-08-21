import { viableIdeas, disruptiveIdeas } from './data/ideas.js?v=5';

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
        <div class="flex items-start justify-between p-3 rounded border mb-2 bg-${accent}-50 min-h-[60px]">
            <div class="flex items-start gap-3 flex-1 min-w-0">
                <span class="text-${accent}-700 font-bold text-sm flex-shrink-0">${idx + 1}º</span>
                <span class="font-medium text-sm leading-relaxed break-words overflow-hidden" style="text-wrap: balance;">${item.title}</span>
            </div>
            <div class="text-${accent}-800 font-semibold text-sm flex-shrink-0 ml-3">${item.total} pts</div>
        </div>
    `).join('');
}

function renderMeta(countParticipants, lastUpdated) {
    const meta = document.getElementById('meta');
    if (!meta) return;
    meta.textContent = `Participantes com envio: ${countParticipants} • Última atualização: ${new Date(lastUpdated).toLocaleTimeString()}`;
}

async function init() {
    const { subscribeSubmissions } = await import('./services/persistence.js?v=5');
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


