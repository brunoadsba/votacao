export function createIdeaCard(idea, currentRating = 0) {
	return `
		<div class="idea-card bg-white p-6 rounded-lg shadow-sm">
			<div class="flex justify-between items-start mb-4">
				<h3 class="text-lg font-semibold text-gray-800 flex-1">${idea.title}</h3>
				<div class="ml-4">
					<button data-action="reset" data-ideaid="${idea.id}" class="text-gray-400 hover:text-red-500 text-sm">
						<i class="fas fa-undo"></i> Zerar
					</button>
				</div>
			</div>
			<p class="text-gray-600 mb-4">${idea.description}</p>
			<div class="flex items-center justify-between">
				<div class="star-rating" data-idea="${idea.id}">
					${Array.from({ length: 10 }, (_, i) =>
						`<i class="fas fa-star star ${i < currentRating ? 'active' : ''}" data-rating="${i + 1}" data-ideaid="${idea.id}" data-action="rate"></i>`
					).join('')}
				</div>
				<span class="text-sm font-medium text-gray-700 rating-display">${currentRating}/10</span>
			</div>
		</div>
	`;
}
