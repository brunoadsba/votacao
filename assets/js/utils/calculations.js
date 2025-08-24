export function aggregateVotesFromSubmissions(submissions) {
	const allVotes = {};
	Object.entries(submissions).forEach(([code, data]) => {
		if (data && data.votes) allVotes[code] = data.votes;
	});
	return allVotes;
}

export function calculateResults(ideas, allVotes) {
	return ideas.map(idea => {
		let totalScore = 0;
		let voteCount = 0;
		Object.values(allVotes).forEach(votes => {
			if (votes[idea.id]) {
				totalScore += votes[idea.id];
				voteCount++;
			}
		});
		return {
			...idea,
			totalScore,
			votes: voteCount,
			average: voteCount > 0 ? totalScore / voteCount : 0
		};
	}).sort((a, b) => b.totalScore - a.totalScore);
}

export function generateResultsText(viableResults, disruptiveResults, allResults, items) {
	let resultsText = '=== RESULTADOS CONSOLIDADOS - SISTEMA DE AVALIAÇÃO E VOTAÇÃO ===\n\n';
	resultsText += '🏆 CAMPEÃO GERAL:\n';
	if (allResults[0]) resultsText += `${allResults[0].title} - ${allResults[0].totalScore} pontos\n\n`;
	resultsText += '🔥 TOP 3 IDEIAS VIÁVEIS:\n';
	viableResults.slice(0, 3).forEach((item, index) => { 
		resultsText += `${index + 1}º - ${item.title} (${item.totalScore} pts)\n`; 
	});
	resultsText += '\n🚀 TOP 3 IDEIAS DISRUPTIVAS:\n';
	disruptiveResults.slice(0, 3).forEach((item, index) => { 
		resultsText += `${index + 1}º - ${item.title} (${item.totalScore} pts)\n`; 
	});
	resultsText += '\n📊 PARTICIPAÇÃO:\n';
	const submittedCount = Object.keys(items).length;
	resultsText += `${submittedCount} participantes enviaram suas votações\n`;
	return resultsText;
}
