export const viableIdeas = [
	{
		id: 'chatbot-suporte',
		title: 'Chatbot de Suporte à Saúde Mental',
		description: 'Protótipo com GPT (via API) para escuta inicial e direcionamento. Pode ser feito em Flask ou Node com frontend simples.'
	},
	{
		id: 'detector-epi',
		title: 'Detector de EPI com Visão Computacional',
		description: 'Usar YOLOv5 ou MobileNet com dataset pequeno (capacete, luva, etc). Protótipo via webcam com feedback visual.'
	},
	{
		id: 'dashboard-preditivo',
		title: 'Dashboard Preditivo de Afastamentos',
		description: 'Simular dados de funcionários e usar scikit-learn para prever risco de afastamento. Interface com Streamlit.'
	},
	{
		id: 'reconhecimento-voz',
		title: 'Reconhecimento de Voz para Relato de Incidentes',
		description: 'Usar API como Whisper ou SpeechRecognition para transformar voz em texto e salvar registros simulados.'
	},
	{
		id: 'analise-sentimentos',
		title: 'Análise de Sentimentos em Feedbacks de Saúde Ocupacional',
		description: 'Treinar um modelo leve (NLTK ou transformers) para analisar textos de pesquisas internas de clima/saúde.'
	},
	{
		id: 'assistente-virtual',
		title: 'Assistente Virtual com IA para Dúvidas sobre Segurança do Trabalho',
		description: 'Chat simples com base de dados de NR (Normas Regulamentadoras) integradas num modelo básico.'
	},
	{
		id: 'treinamento-gamificado',
		title: 'Plataforma de Treinamento Gamificado com IA',
		description: 'Quiz adaptativo com Python/Flask + IA para ajustar dificuldade conforme acertos/erros do usuário.'
	}
];

export const disruptiveIdeas = [
	{
		id: 'digital-twin',
		title: 'Digital Twin de Segurança e Saúde Ocupacional',
		description: 'Criar um "gêmeo digital" do ambiente de trabalho usando sensores e IA para simular riscos, prever acidentes e testar medidas preventivas em tempo real.'
	},
	{
		id: 'prevencao-burnout',
		title: 'IA para Prevenção de Burnout em Tempo Real',
		description: 'Algoritmo que cruza padrões de e-mails, mensagens internas (via API fake) e horas trabalhadas para detectar sinais de esgotamento mental ou burnout.'
	},
	{
		id: 'monitoramento-comportamental',
		title: 'Monitoramento Comportamental com IA e Gamificação',
		description: 'IA que analisa o comportamento dos trabalhadores (interações, uso de EPIs, pausas) e dá feedbacks gamificados para incentivar hábitos saudáveis.'
	},
	{
		id: 'anjo-virtual',
		title: 'Anjo Virtual de Primeiros Socorros com IA Multimodal',
		description: 'Assistente com IA (voz + texto + imagem) para guiar colaboradores em emergências, usando linguagem natural e reconhecimento de objetos/situações.'
	},
	{
		id: 'ia-etica',
		title: 'IA Ética para Acompanhamento de Inclusão e Diversidade',
		description: 'Ferramenta que analisa dados de saúde e segurança com foco em equidade, identificando disparidades no cuidado com grupos específicos (PDCs, mulheres, etc.).'
	},
	{
		id: 'auditoria-inteligente',
		title: 'Sistema Inteligente de Auditoria de SST via IA',
		description: 'Plataforma que audita automaticamente dados de SST (documentos, fotos, vídeos) com IA e gera alertas de não conformidades com as NRs.'
	},
	{
		id: 'previsao-doencas',
		title: 'IA Previsora de Doenças Ocupacionais por Perfil Funcional',
		description: 'Modelo de machine learning que, com base no cargo, atividades e histórico clínico, projeta a probabilidade de desenvolver doenças como LER/DORT, surdez, etc.'
	}
];

