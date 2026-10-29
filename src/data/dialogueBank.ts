import { TargetLanguage, HintLadderStep } from "@/types/game";

export interface MockDialogueResponse {
  characterReply: string;
  translation: string;
  corrections?: Array<{ original: string; suggested: string; explanation: string }>;
  naturalAlternatives?: string[];
  advanceTask?: boolean;
}

export interface ScenarioHintData {
  steps: HintLadderStep[];
}

export const HINTS_BY_TASK: Record<string, Record<TargetLanguage, ScenarioHintData>> = {
  "d1-t1": {
    fr: {
      steps: [
        {
          level: 1,
          clue: "Introduce yourself to Mme Laurent. Give your name and say hello.",
        },
        {
          level: 2,
          clue: "Use phrases like 'Bonjour !' and 'Je m'appelle...'",
          phrases: ["Bonjour !", "Je m'appelle...", "Enchanté !"],
        },
        {
          level: 3,
          clue: "Complete model sentence:",
          translation: "Hello! My name is Alex, pleased to meet you.",
          modelReply: "Bonjour ! Je m'appelle Alex, enchanté.",
        },
      ],
    },
    es: {
      steps: [
        {
          level: 1,
          clue: "Saluda a la Sra. Laurent y preséntate diciendo tu nombre.",
        },
        {
          level: 2,
          clue: "Usa frases como '¡Hola!' y 'Me llamo...'",
          phrases: ["¡Hola!", "Me llamo...", "¡Mucho gusto!"],
        },
        {
          level: 3,
          clue: "Oración completa sugerida:",
          translation: "Hello! My name is Alex, nice to meet you.",
          modelReply: "¡Hola! Me llamo Alex, mucho gusto.",
        },
      ],
    },
    it: {
      steps: [
        {
          level: 1,
          clue: "Saluta la Signora Laurent e presentati con il tuo nome.",
        },
        {
          level: 2,
          clue: "Usa espressioni come 'Buongiorno!' e 'Mi chiamo...'",
          phrases: ["Buongiorno!", "Mi chiamo...", "Piacere!"],
        },
        {
          level: 3,
          clue: "Frase completa consigliata:",
          translation: "Hello! My name is Alex, pleased to meet you.",
          modelReply: "Buongiorno! Mi chiamo Alex, piacere di conoscerla.",
        },
      ],
    },
    en: {
      steps: [
        {
          level: 1,
          clue: "Greet Mrs. Laurent and introduce yourself.",
        },
        {
          level: 2,
          clue: "Use friendly expressions like 'Hello!' and 'My name is...'",
          phrases: ["Hello!", "My name is...", "Nice to meet you!"],
        },
        {
          level: 3,
          clue: "Complete suggested response:",
          translation: "Hello! My name is Alex, nice to meet you.",
          modelReply: "Hello! My name is Alex, nice to meet you.",
        },
      ],
    },
  },
  "d2-t2": {
    fr: {
      steps: [
        {
          level: 1,
          clue: "Étienne is asking what you'd like. Look at the crate of apples — how many do you want?",
        },
        {
          level: 2,
          clue: "Use 'Je voudrais...' (I would like) rather than 'Je veux' (I want).",
          phrases: ["Je voudrais...", "Trois pommes", "Un kilo de pommes, s'il vous plaît"],
        },
        {
          level: 3,
          clue: "Complete model reply:",
          translation: "I would like three apples and a baguette, please.",
          modelReply: "Bonjour ! Je voudrais trois pommes et une baguette, s'il vous plaît.",
        },
      ],
    },
    es: {
      steps: [
        {
          level: 1,
          clue: "Esteban te pregunta qué deseas. Pide manzanas y pan.",
        },
        {
          level: 2,
          clue: "Usa 'Quisiera...' o 'Me gustaría...' en lugar de formas cortantes.",
          phrases: ["Quisiera...", "Tres manzanas", "Por favor"],
        },
        {
          level: 3,
          clue: "Oración completa recomendada:",
          translation: "I would like three apples and some bread, please.",
          modelReply: "¡Hola! Quisiera tres manzanas y pan, por favor.",
        },
      ],
    },
    it: {
      steps: [
        {
          level: 1,
          clue: "Stefano ti chiede cosa desideri. Chiedi delle mele.",
        },
        {
          level: 2,
          clue: "Usa la forma gentile 'Vorrei...' (Vorrei delle mele).",
          phrases: ["Vorrei...", "Tre mele", "Per favore"],
        },
        {
          level: 3,
          clue: "Frase completa:",
          translation: "I would like three apples and bread, please.",
          modelReply: "Buongiorno! Vorrei tre mele e del pane, per favore.",
        },
      ],
    },
    en: {
      steps: [
        {
          level: 1,
          clue: "The grocer asks what you need. Order apples and bread.",
        },
        {
          level: 2,
          clue: "Use polite phrasing like 'I would like...' or 'Could I have...'",
          phrases: ["I would like...", "Three apples", "Please"],
        },
        {
          level: 3,
          clue: "Complete phrase:",
          translation: "I would like three apples and a loaf of bread, please.",
          modelReply: "Hello! I would like three apples and some bread, please.",
        },
      ],
    },
  },
  "d2-t3": {
    fr: {
      steps: [
        {
          level: 1,
          clue: "Ask Étienne about the total price.",
        },
        {
          level: 2,
          clue: "Use 'Combien ça coûte ?' or 'Ça fait combien ?'",
          phrases: ["Combien ça coûte ?", "Ça fait combien ?", "Le prix total"],
        },
        {
          level: 3,
          clue: "Complete model phrase:",
          translation: "How much is it in total, please?",
          modelReply: "Combien ça coûte au total, s'il vous plaît ?",
        },
      ],
    },
    es: {
      steps: [
        {
          level: 1,
          clue: "Pregunta a Esteban por el precio.",
        },
        {
          level: 2,
          clue: "Usa '¿Cuánto cuesta?' o '¿Cuánto es?'",
          phrases: ["¿Cuánto cuesta?", "¿Cuánto es?", "En total"],
        },
        {
          level: 3,
          clue: "Oración completa:",
          translation: "How much is it altogether?",
          modelReply: "¿Cuánto cuesta en total, por favor?",
        },
      ],
    },
    it: {
      steps: [
        {
          level: 1,
          clue: "Chiedi il prezzo delle mele.",
        },
        {
          level: 2,
          clue: "Usa 'Quanto costa?' o 'Quant'è in totale?'",
          phrases: ["Quanto costa?", "Quant'è in totale?", "Per favore"],
        },
        {
          level: 3,
          clue: "Frase completa:",
          translation: "How much does it cost in total?",
          modelReply: "Quanto costa in totale, per favore?",
        },
      ],
    },
    en: {
      steps: [
        {
          level: 1,
          clue: "Ask for the total price.",
        },
        {
          level: 2,
          clue: "Use 'How much is it?' or 'How much does it cost?'",
          phrases: ["How much is that?", "What is the total?", "Please"],
        },
        {
          level: 3,
          clue: "Complete phrase:",
          translation: "How much does it cost in total, please?",
          modelReply: "How much does it cost in total, please?",
        },
      ],
    },
  },
};

export const INITIAL_DIALOGUE_BY_NPC: Record<string, Record<TargetLanguage, { text: string; translation: string }>> = {
  mme_laurent: {
    fr: {
      text: "Bonjour ! Vous êtes le nouveau locataire de l'appartement au premier étage ?",
      translation: "Hello! Are you the new tenant of the first-floor apartment?",
    },
    es: {
      text: "¡Hola! ¿Es usted el nuevo inquilino del apartamento del primer piso?",
      translation: "Hello! Are you the new tenant for the first-floor apartment?",
    },
    it: {
      text: "Buongiorno! Lei è il nuovo inquilino dell'appartamento al primo piano?",
      translation: "Hello! Are you the new tenant of the first-floor apartment?",
    },
    en: {
      text: "Hello! Are you the new tenant moving into the first-floor apartment?",
      translation: "Hello! Are you the new tenant moving into the first-floor apartment?",
    },
  },
  mme_laurent_d5: {
    fr: {
      text: "Bonjour ! Tout se passe bien ? Vous avez l'air inquiet, y a-t-il un problème dans l'appartement ?",
      translation: "Hello! Is everything going well? You look worried, is there a problem in the apartment?",
    },
    es: {
      text: "¡Hola! ¿Va todo bien? Parece preocupado, ¿hay algún problema en el apartamento?",
      translation: "Hello! Is everything okay? You look worried, is there a problem in the apartment?",
    },
    it: {
      text: "Buongiorno! Va tutto bene? Sembra preoccupato, c'è un problema nell'appartamento?",
      translation: "Good day! Is everything alright? You seem worried, is there a problem in the apartment?",
    },
    en: {
      text: "Hello! Is everything alright? You look concerned — is there an issue in your apartment?",
      translation: "Hello! Is everything alright? You look concerned — is there an issue in your apartment?",
    },
  },
  mme_laurent_d7: {
    fr: {
      text: "Bonjour ! Déjà une semaine complète dans notre quartier. Vous vous sentez comme chez vous ?",
      translation: "Hello! A full week in our neighbourhood already. Do you feel right at home?",
    },
    es: {
      text: "¡Hola! Ya una semana completa en nuestro barrio. ¿Se siente como en casa?",
      translation: "Hello! A full week in our neighbourhood already. Do you feel at home?",
    },
    it: {
      text: "Buongiorno! Già una settimana intera nel nostro quartiere. Si sente a casa?",
      translation: "Good day! Already a full week in our neighbourhood. Do you feel at home?",
    },
    en: {
      text: "Hello! A whole week in our neighbourhood already. Are you feeling right at home?",
      translation: "Hello! A whole week in our neighbourhood already. Are you feeling right at home?",
    },
  },
  etienne: {
    fr: {
      text: "Bonjour mon ami ! Bienvenue à l'épicerie. Qu'est-ce que je vous sers aujourd'hui ?",
      translation: "Hello my friend! Welcome to the grocery. What can I get for you today?",
    },
    es: {
      text: "¡Hola amigo! Bienvenido a la tienda. ¿Qué le puedo ofrecer hoy?",
      translation: "Hello friend! Welcome to the shop. What can I serve you today?",
    },
    it: {
      text: "Buongiorno! Benvenuto all'alimentari. Cosa le posso preparare oggi?",
      translation: "Good day! Welcome to the grocery store. What can I get you today?",
    },
    en: {
      text: "Hello there! Welcome to the neighbourhood grocer. What can I get for you today?",
      translation: "Hello there! Welcome to the neighbourhood grocer. What can I get for you today?",
    },
  },
  lucas: {
    fr: {
      text: "Salut ! Tu as besoin d'aide pour trouver un itinéraire de bus ou acheter un ticket ?",
      translation: "Hi! Do you need help finding a bus route or buying a ticket?",
    },
    es: {
      text: "¡Hola! ¿Necesitas ayuda con los horarios de autobús o un billete de viaje?",
      translation: "Hello! Do you need help with the bus schedule or a travel ticket?",
    },
    it: {
      text: "Ciao! Hai bisogno di aiuto per trovare l'autobus o fare un biglietto?",
      translation: "Hi! Do you need help finding the bus or getting a ticket?",
    },
    en: {
      text: "Hi there! Looking for the right bus route or need to pick up a transit ticket?",
      translation: "Hi there! Looking for the right bus route or need to pick up a transit ticket?",
    },
  },
  camille: {
    fr: {
      text: "Bonjour ! Installez-vous en terrasse. Qu'est-ce qui vous ferait plaisir ce matin ?",
      translation: "Hello! Take a seat on the terrace. What would you like this morning?",
    },
    es: {
      text: "¡Buenos días! Siéntate en la terraza. ¿Qué te apetece tomar esta mañana?",
      translation: "Good morning! Have a seat on the terrace. What would you like this morning?",
    },
    it: {
      text: "Buongiorno! Prego, si accomodi in terrazza. Cosa le porto di buono?",
      translation: "Good morning! Please, take a seat on the terrace. What can I bring you?",
    },
    en: {
      text: "Good morning! Please grab a table on the terrace. What can I get started for you?",
      translation: "Good morning! Please grab a table on the terrace. What can I get started for you?",
    },
  },
  sofia: {
    fr: {
      text: "Bonsoir et bienvenue à notre soirée de quartier ! Comment s'est passée votre première semaine ?",
      translation: "Good evening and welcome to our neighbourhood gathering! How was your first week?",
    },
    es: {
      text: "¡Buenas noches y bienvenido a la fiesta vecinal! ¿Cómo ha ido tu primera semana?",
      translation: "Good evening and welcome to our neighbourhood party! How was your first week?",
    },
    it: {
      text: "Buonasera e benvenuto alla festa del quartiere! Com'è andata la tua prima settimana?",
      translation: "Good evening and welcome to the neighbourhood party! How has your first week been?",
    },
    en: {
      text: "Good evening and welcome to our neighbourhood get-together! How has your first week been?",
      translation: "Good evening and welcome to our neighbourhood get-together! How has your first week been?",
    },
  },
};

export interface SuggestedResponse {
  text: string;
  translation: string;
}

export const SUGGESTED_RESPONSES_BY_TASK: Record<string, Record<TargetLanguage, SuggestedResponse[]>> = {
  "d1-t1": {
    fr: [
      { text: "Bonjour ! Oui, je m'appelle Alex, enchanté.", translation: "Hello! Yes, my name is Alex, pleased to meet you." },
      { text: "Bonjour Madame Laurent, c'est bien moi !", translation: "Hello Mrs. Laurent, that's me!" },
      { text: "Oui tout à fait, je suis le nouveau locataire.", translation: "Yes indeed, I am the new tenant." },
    ],
    es: [
      { text: "¡Hola! Sí, me llamo Alex, mucho gusto.", translation: "Hello! Yes, my name is Alex, nice to meet you." },
      { text: "¡Hola Sra. Laurent, soy yo el nuevo inquilino!", translation: "Hello Mrs. Laurent, I'm the new tenant!" },
    ],
    it: [
      { text: "Buongiorno! Sì, mi chiamo Alex, piacere.", translation: "Good day! Yes, my name is Alex, nice to meet you." },
      { text: "Buongiorno Signora Laurent, sono proprio io!", translation: "Good day Mrs. Laurent, that is indeed me!" },
    ],
    en: [
      { text: "Hello! Yes, my name is Alex, pleased to meet you.", translation: "Hello! Yes, my name is Alex, pleased to meet you." },
      { text: "Hello Mrs. Laurent, that's me moving into the apartment!", translation: "Hello Mrs. Laurent, that's me moving into the apartment!" },
    ],
  },
  "d1-t2": {
    fr: [
      { text: "Oui, je viens d'arriver pour la semaine.", translation: "Yes, I just arrived for the week." },
      { text: "Je suis très heureux d'emménager dans cet appartement.", translation: "I am very happy to move into this apartment." },
    ],
    es: [
      { text: "Sí, acabo de llegar para pasar la semana.", translation: "Yes, I just arrived for the week." },
    ],
    it: [
      { text: "Sì, sono appena arrivato per la settimana.", translation: "Yes, I just arrived for the week." },
    ],
    en: [
      { text: "Yes, I just arrived for my week-long stay.", translation: "Yes, I just arrived for my week-long stay." },
    ],
  },
  "d1-t3": {
    fr: [
      { text: "Merci beaucoup pour les clés ! Où puis-je trouver une épicerie ?", translation: "Thank you for the keys! Where can I find a grocery?" },
      { text: "Merci pour tout, bonne journée Madame Laurent !", translation: "Thank you for everything, have a good day Mrs. Laurent!" },
    ],
    es: [
      { text: "¡Muchas gracias por las llaves! ¿Dónde hay una tienda cerca?", translation: "Thank you for the keys! Where is there a nearby shop?" },
    ],
    it: [
      { text: "Grazie mille per le chiavi! Dove posso trovare un alimentari?", translation: "Thank you so much for the keys! Where can I find a grocery?" },
    ],
    en: [
      { text: "Thank you for the keys! Where can I find a grocery nearby?", translation: "Thank you for the keys! Where can I find a grocery nearby?" },
    ],
  },
  "d2-t1": {
    fr: [
      { text: "Bonjour Étienne ! Votre boutique a l'air formidable.", translation: "Hello Étienne! Your shop looks wonderful." },
      { text: "Bonjour ! On m'a dit le plus grand bien de votre épicerie.", translation: "Hello! I was told wonderful things about your grocery store." },
    ],
    es: [
      { text: "¡Hola Esteban! Su tienda parece estupenda.", translation: "Hello Esteban! Your shop looks wonderful." },
    ],
    it: [
      { text: "Buongiorno Stefano! La sua bottega è bellissima.", translation: "Good day Stefano! Your shop is lovely." },
    ],
    en: [
      { text: "Good morning Étienne! Your shop looks delightful.", translation: "Good morning Étienne! Your shop looks delightful." },
    ],
  },
  "d2-t2": {
    fr: [
      { text: "Bonjour ! Je voudrais trois pommes, s'il vous plaît.", translation: "Hello! I would like three apples, please." },
      { text: "Avez-vous des pommes fraîches et du pain ?", translation: "Do you have fresh apples and bread?" },
    ],
    es: [
      { text: "¡Hola! Quisiera tres manzanas, por favor.", translation: "Hello! I would like three apples, please." },
    ],
    it: [
      { text: "Buongiorno! Vorrei tre mele, per favore.", translation: "Good day! I would like three apples, please." },
    ],
    en: [
      { text: "Hello! I would like three apples and bread, please.", translation: "Hello! I would like three apples and bread, please." },
    ],
  },
  "d2-t3": {
    fr: [
      { text: "Combien ça coûte au total, s'il vous plaît ?", translation: "How much does it cost in total, please?" },
      { text: "Ça fait combien pour les pommes ?", translation: "How much is that for the apples?" },
    ],
    es: [
      { text: "¿Cuánto cuesta en total, por favor?", translation: "How much is it in total, please?" },
    ],
    it: [
      { text: "Quanto costa in totale, per favore?", translation: "How much does it cost in total, please?" },
    ],
    en: [
      { text: "How much does it cost in total, please?", translation: "How much does it cost in total, please?" },
    ],
  },
  "d2-t4": {
    fr: [
      { text: "Voilà 3 euros, merci beaucoup !", translation: "Here is 3 euros, thank you very much!" },
      { text: "Je règle par carte, merci et bonne journée !", translation: "I'll pay by card, thank you and have a great day!" },
    ],
    es: [
      { text: "Aquí tiene el dinero, ¡muchas gracias!", translation: "Here is the money, thank you very much!" },
    ],
    it: [
      { text: "Ecco i soldi, grazie mille e buona giornata!", translation: "Here is the money, thank you and have a good day!" },
    ],
    en: [
      { text: "Here is the payment, thank you very much!", translation: "Here is the payment, thank you very much!" },
    ],
  },
  // Day 3 - transit tasks
  "d3-t1": {
    fr: [
      { text: "Excusez-moi, comment puis-je aller au centre-ville ?", translation: "Excuse me, how can I get to the city centre?" },
      { text: "Quel bus dois-je prendre pour aller en ville ?", translation: "Which bus should I take to go to town?" },
      { text: "Où est l'arrêt de bus le plus proche, s'il vous plaît ?", translation: "Where is the nearest bus stop, please?" },
    ],
    es: [
      { text: "Perdone, ¿cómo puedo ir al centro de la ciudad?", translation: "Excuse me, how can I get to the city centre?" },
      { text: "¿Qué autobús tengo que tomar para ir al centro?", translation: "Which bus should I take to go to the centre?" },
    ],
    it: [
      { text: "Scusi, come posso andare in centro città?", translation: "Excuse me, how can I get to the city centre?" },
      { text: "Quale autobus devo prendere per andare in centro?", translation: "Which bus should I take to go to the centre?" },
    ],
    en: [
      { text: "Excuse me, how can I get to the city centre?", translation: "Excuse me, how can I get to the city centre?" },
      { text: "Which bus goes to the town centre from here?", translation: "Which bus goes to the town centre from here?" },
    ],
  },
  "d3-t2": {
    fr: [
      { text: "À quelle heure part le prochain bus ?", translation: "What time does the next bus leave?" },
      { text: "Est-ce qu'il y a un bus toutes les dix minutes ?", translation: "Is there a bus every ten minutes?" },
      { text: "À quelle heure arrive le bus pour le centre ?", translation: "What time does the bus to the centre arrive?" },
    ],
    es: [
      { text: "¿A qué hora sale el próximo autobús?", translation: "What time does the next bus leave?" },
      { text: "¿Hay un autobús cada diez minutos?", translation: "Is there a bus every ten minutes?" },
    ],
    it: [
      { text: "A che ora parte il prossimo autobus?", translation: "What time does the next bus leave?" },
      { text: "C'è un autobus ogni dieci minuti?", translation: "Is there a bus every ten minutes?" },
    ],
    en: [
      { text: "What time does the next bus depart?", translation: "What time does the next bus depart?" },
      { text: "How often do buses run to the city centre?", translation: "How often do buses run to the city centre?" },
    ],
  },
  "d3-t3": {
    fr: [
      { text: "Un ticket simple pour le centre-ville, s'il vous plaît.", translation: "One single ticket to the city centre, please." },
      { text: "Je voudrais un ticket aller-retour pour aujourd'hui.", translation: "I would like a return ticket for today." },
      { text: "Combien coûte un ticket de bus pour le centre ?", translation: "How much does a bus ticket to the centre cost?" },
    ],
    es: [
      { text: "Un billete sencillo al centro, por favor.", translation: "One single ticket to the centre, please." },
      { text: "¿Cuánto cuesta un billete para el centro?", translation: "How much does a ticket to the centre cost?" },
    ],
    it: [
      { text: "Un biglietto semplice per il centro, per favore.", translation: "One single ticket to the centre, please." },
      { text: "Quanto costa un biglietto per il centro?", translation: "How much does a ticket to the centre cost?" },
    ],
    en: [
      { text: "One single ticket to the city centre, please.", translation: "One single ticket to the city centre, please." },
      { text: "How much is a bus ticket to the town centre?", translation: "How much is a bus ticket to the town centre?" },
    ],
  },
  // Day 4 - café tasks
  "d4-t1": {
    fr: [
      { text: "Bonjour ! Je voudrais un café et un croissant, s'il vous plaît.", translation: "Hello! I would like a coffee and a croissant, please." },
      { text: "Un café au lait et une tartine beurrée, s'il vous plaît.", translation: "A white coffee and buttered toast, please." },
      { text: "Bonjour ! Qu'est-ce que vous recommandez ce matin ?", translation: "Hello! What do you recommend this morning?" },
    ],
    es: [
      { text: "¡Buenos días! Un café con leche y un croissant, por favor.", translation: "Good morning! A white coffee and a croissant, please." },
      { text: "¿Qué me recomienda tomar esta mañana?", translation: "What do you recommend this morning?" },
    ],
    it: [
      { text: "Buongiorno! Un cappuccino e un cornetto, per favore.", translation: "Good morning! A cappuccino and a croissant, please." },
      { text: "Cosa mi consiglia per colazione?", translation: "What do you recommend for breakfast?" },
    ],
    en: [
      { text: "Good morning! A coffee and a croissant, please.", translation: "Good morning! A coffee and a croissant, please." },
      { text: "What would you recommend from the menu today?", translation: "What would you recommend from the menu today?" },
    ],
  },
  "d4-t2": {
    fr: [
      { text: "C'est délicieux ! Ça fait combien, s'il vous plaît ?", translation: "It's delicious! How much is it, please?" },
      { text: "L'addition, s'il vous plaît. Je paye par carte.", translation: "The bill, please. I'll pay by card." },
      { text: "Merci beaucoup, c'était excellent ! À bientôt.", translation: "Thank you very much, it was excellent! See you soon." },
    ],
    es: [
      { text: "¡Está delicioso! ¿Cuánto es, por favor?", translation: "It's delicious! How much is it, please?" },
      { text: "La cuenta, por favor. Pago con tarjeta.", translation: "The bill, please. I'll pay by card." },
    ],
    it: [
      { text: "È squisito! Quanto costa, per favore?", translation: "It's exquisite! How much is it, please?" },
      { text: "Il conto, per favore. Pago con carta.", translation: "The bill, please. I'll pay by card." },
    ],
    en: [
      { text: "It's delicious! What's the bill, please?", translation: "It's delicious! What's the bill, please?" },
      { text: "Could I have the bill please? I'll pay by card.", translation: "Could I have the bill please? I'll pay by card." },
    ],
  },
  "d4-t3": {
    fr: [
      { text: "Il fait vraiment beau aujourd'hui, n'est-ce pas ?", translation: "The weather is really lovely today, isn't it?" },
      { text: "La terrasse est magnifique ! Vous êtes souvent très occupée ?", translation: "The terrace is beautiful! Are you usually very busy?" },
      { text: "Je suis nouveau dans le quartier. C'est un endroit agréable.", translation: "I'm new to the neighbourhood. It's a lovely place." },
    ],
    es: [
      { text: "Hace muy buen tiempo hoy, ¿verdad?", translation: "The weather is really lovely today, isn't it?" },
      { text: "La terraza es preciosa. ¿Suele estar muy ocupada?", translation: "The terrace is beautiful. Are you usually very busy?" },
    ],
    it: [
      { text: "Che bella giornata oggi, vero?", translation: "What a lovely day today, isn't it?" },
      { text: "La terrazza è bellissima! È sempre così animata?", translation: "The terrace is beautiful! Is it always this lively?" },
    ],
    en: [
      { text: "What lovely weather today, isn't it?", translation: "What lovely weather today, isn't it?" },
      { text: "The terrace is beautiful! Is it always this busy?", translation: "The terrace is beautiful! Is it always this busy?" },
    ],
  },
  "d4-t4": {
    fr: [
      { text: "L'addition, s'il vous plaît. C'était délicieux !", translation: "The bill, please. It was delicious!" },
      { text: "Je voudrais payer, s'il vous plaît.", translation: "I would like to pay, please." },
      { text: "Merci beaucoup Camille, à très bientôt !", translation: "Thank you very much Camille, see you very soon!" },
    ],
    es: [
      { text: "La cuenta, por favor. ¡Todo estaba delicioso!", translation: "The bill, please. Everything was delicious!" },
      { text: "Quisiera pagar, por favor.", translation: "I would like to pay, please." },
    ],
    it: [
      { text: "Il conto, per favore. Era tutto squisito!", translation: "The bill, please. Everything was exquisite!" },
      { text: "Vorrei pagare, per favore.", translation: "I would like to pay, please." },
    ],
    en: [
      { text: "Could I have the bill please? Everything was delicious!", translation: "Could I have the bill please? Everything was delicious!" },
      { text: "I'd like to pay when you're ready, please.", translation: "I'd like to pay when you're ready, please." },
    ],
  },
  // Day 5 - plumbing problem tasks
  "d5-t1": {
    fr: [
      { text: "Madame Laurent, j'ai un problème urgent dans mon appartement.", translation: "Mrs. Laurent, I have an urgent problem in my apartment." },
      { text: "Excusez-moi de vous déranger, mais il y a une fuite d'eau chez moi.", translation: "Sorry to bother you, but there is a water leak in my flat." },
      { text: "Bonjour Madame Laurent, pouvez-vous m'aider ? C'est urgent.", translation: "Hello Mrs. Laurent, can you help me? It's urgent." },
    ],
    es: [
      { text: "Señora Laurent, tengo un problema urgente en mi apartamento.", translation: "Mrs. Laurent, I have an urgent problem in my apartment." },
      { text: "Disculpe que la moleste, pero hay una fuga de agua en mi piso.", translation: "Sorry to bother you, but there is a water leak in my flat." },
    ],
    it: [
      { text: "Signora Laurent, ho un problema urgente nel mio appartamento.", translation: "Mrs. Laurent, I have an urgent problem in my apartment." },
      { text: "Mi scusi se la disturbo, ma c'è una perdita d'acqua nel mio appartamento.", translation: "Sorry to bother you, but there is a water leak in my flat." },
    ],
    en: [
      { text: "Mrs. Laurent, I have an urgent problem in my apartment.", translation: "Mrs. Laurent, I have an urgent problem in my apartment." },
      { text: "Sorry to bother you, but there's a water leak in my flat.", translation: "Sorry to bother you, but there's a water leak in my flat." },
    ],
  },
  "d5-t2": {
    fr: [
      { text: "Il y a une fuite d'eau sous l'évier de la cuisine.", translation: "There is a water leak under the kitchen sink." },
      { text: "Le robinet du lavabo de la salle de bain fuit depuis ce matin.", translation: "The bathroom tap has been leaking since this morning." },
      { text: "L'eau coule du plafond de la salle de bain, c'est grave !", translation: "Water is dripping from the bathroom ceiling, it's serious!" },
    ],
    es: [
      { text: "Hay una fuga de agua debajo del fregadero de la cocina.", translation: "There is a water leak under the kitchen sink." },
      { text: "El grifo del baño lleva goteando desde esta mañana.", translation: "The bathroom tap has been dripping since this morning." },
    ],
    it: [
      { text: "C'è una perdita d'acqua sotto il lavello della cucina.", translation: "There is a water leak under the kitchen sink." },
      { text: "Il rubinetto del bagno perde dall'esta mattina.", translation: "The bathroom tap has been leaking since this morning." },
    ],
    en: [
      { text: "There's a water leak under the kitchen sink.", translation: "There's a water leak under the kitchen sink." },
      { text: "The bathroom tap has been dripping since this morning.", translation: "The bathroom tap has been dripping since this morning." },
    ],
  },
  "d5-t3": {
    fr: [
      { text: "Demain matin à 9h, c'est parfait pour moi. Merci beaucoup !", translation: "Tomorrow morning at 9am is perfect for me. Thank you very much!" },
      { text: "Je serai disponible toute la matinée. Merci de votre aide !", translation: "I'll be available all morning. Thank you for your help!" },
      { text: "D'accord pour demain. Est-ce que je dois être là pour le plombier ?", translation: "Agreed for tomorrow. Do I need to be there for the plumber?" },
    ],
    es: [
      { text: "Mañana por la mañana a las 9 me viene perfecto. ¡Muchas gracias!", translation: "Tomorrow morning at 9 is perfect for me. Thank you very much!" },
      { text: "Estaré disponible toda la mañana. ¡Gracias por su ayuda!", translation: "I'll be available all morning. Thank you for your help!" },
    ],
    it: [
      { text: "Domani mattina alle 9 va benissimo per me. Grazie mille!", translation: "Tomorrow morning at 9 is perfect for me. Thank you very much!" },
      { text: "Sarò disponibile tutta la mattina. Grazie per l'aiuto!", translation: "I'll be available all morning. Thank you for your help!" },
    ],
    en: [
      { text: "Tomorrow morning at 9am is perfect for me, thank you!", translation: "Tomorrow morning at 9am is perfect for me, thank you!" },
      { text: "I'll be home all morning. Thank you so much for your help!", translation: "I'll be home all morning. Thank you so much for your help!" },
    ],
  },
  // Day 6 - social life tasks
  "d6-t1": {
    fr: [
      { text: "Bonsoir ! Je suis le nouveau voisin, enchanté de vous rencontrer.", translation: "Good evening! I am the new neighbour, pleased to meet you." },
      { text: "Bonsoir Sofia ! Quelle belle soirée vous avez organisée !", translation: "Good evening Sofia! What a lovely evening you have organized!" },
      { text: "Bonsoir ! Ma première semaine ici s'est très bien passée, merci.", translation: "Good evening! My first week here has gone very well, thank you." },
    ],
    es: [
      { text: "¡Buenas noches! Soy el nuevo vecino, encantado de conocerle.", translation: "Good evening! I am the new neighbour, nice to meet you." },
      { text: "¡Buenas noches Sofía! ¡Qué fiesta tan bonita habéis organizado!", translation: "Good evening Sofia! What a lovely party you have organized!" },
    ],
    it: [
      { text: "Buonasera! Sono il nuovo vicino, piacere di conoscerla.", translation: "Good evening! I am the new neighbour, nice to meet you." },
      { text: "Buonasera Sofia! Che bella serata avete organizzato!", translation: "Good evening Sofia! What a lovely evening you have organized!" },
    ],
    en: [
      { text: "Good evening! I'm the new neighbour — so pleased to meet you.", translation: "Good evening! I'm the new neighbour — so pleased to meet you." },
      { text: "Good evening Sofia! What a wonderful gathering you've put together!", translation: "Good evening Sofia! What a wonderful gathering you've put together!" },
    ],
  },
  "d6-t2": {
    fr: [
      { text: "Ma première semaine était vraiment fantastique ! J'ai adoré le quartier.", translation: "My first week was truly fantastic! I loved the neighbourhood." },
      { text: "C'était super ! J'ai rencontré beaucoup de voisins sympathiques.", translation: "It was great! I met a lot of friendly neighbours." },
      { text: "Très bien, merci ! J'ai visité le marché et le café du coin.", translation: "Very well, thank you! I visited the market and the local café." },
    ],
    es: [
      { text: "¡Mi primera semana fue fantástica! Me encantó el barrio.", translation: "My first week was fantastic! I loved the neighbourhood." },
      { text: "¡Muy bien! Conocí a muchos vecinos simpáticos.", translation: "Very well! I met many friendly neighbours." },
    ],
    it: [
      { text: "La mia prima settimana è stata fantastica! Adoro il quartiere.", translation: "My first week was fantastic! I love the neighbourhood." },
      { text: "Molto bene! Ho incontrato tanti vicini simpatici.", translation: "Very well! I met many friendly neighbours." },
    ],
    en: [
      { text: "My first week has been absolutely wonderful! I love this neighbourhood.", translation: "My first week has been absolutely wonderful! I love this neighbourhood." },
      { text: "It's been great! I've met so many friendly people here.", translation: "It's been great! I've met so many friendly people here." },
    ],
  },
  "d6-t3": {
    fr: [
      { text: "Je suis libre samedi soir pour aller au café ensemble.", translation: "I'm free Saturday evening to go to the café together." },
      { text: "Avec plaisir ! Je serais ravi de rejoindre le groupe de voisins.", translation: "With pleasure! I would love to join the neighbours' group." },
      { text: "Bonne idée ! À quelle heure et où se retrouve-t-on ?", translation: "Good idea! What time and where shall we meet?" },
    ],
    es: [
      { text: "Estoy libre el sábado por la noche para ir al café juntos.", translation: "I'm free Saturday evening to go to the café together." },
      { text: "¡Con mucho gusto! Me encantaría unirme al grupo de vecinos.", translation: "With pleasure! I'd love to join the neighbours' group." },
    ],
    it: [
      { text: "Sono libero sabato sera per andare al caffè insieme.", translation: "I'm free Saturday evening to go to the café together." },
      { text: "Con piacere! Sarei felice di unirmi al gruppo di vicini.", translation: "With pleasure! I'd be happy to join the neighbours' group." },
    ],
    en: [
      { text: "I'm free Saturday evening to go to the café together!", translation: "I'm free Saturday evening to go to the café together!" },
      { text: "I'd love to join the neighbours' group — sounds wonderful!", translation: "I'd love to join the neighbours' group — sounds wonderful!" },
    ],
  },
  // Day 7 - independent day tasks
  "d7-t1": {
    fr: [
      { text: "Bonjour ! Je voudrais faire quelques courses ce matin.", translation: "Good morning! I would like to do some shopping this morning." },
      { text: "Bonjour ! J'ai besoin d'aide pour trouver la pharmacie.", translation: "Good morning! I need help finding the pharmacy." },
      { text: "Excusez-moi, pouvez-vous me recommander un bon restaurant ?", translation: "Excuse me, could you recommend a good restaurant?" },
    ],
    es: [
      { text: "¡Buenos días! Me gustaría hacer algunas compras esta mañana.", translation: "Good morning! I'd like to do some shopping this morning." },
      { text: "Buenos días, necesito encontrar la farmacia.", translation: "Good morning, I need to find the pharmacy." },
    ],
    it: [
      { text: "Buongiorno! Vorrei fare alcune commissioni stamattina.", translation: "Good morning! I'd like to do some errands this morning." },
      { text: "Buongiorno, ho bisogno di trovare la farmacia.", translation: "Good morning, I need to find the pharmacy." },
    ],
    en: [
      { text: "Good morning! I'd like to run a few errands this morning.", translation: "Good morning! I'd like to run a few errands this morning." },
      { text: "Excuse me, could you point me to the nearest pharmacy?", translation: "Excuse me, could you point me to the nearest pharmacy?" },
    ],
  },
  "d7-t2": {
    fr: [
      { text: "Je suis tellement content d'avoir passé cette semaine ici !", translation: "I'm so happy to have spent this week here!" },
      { text: "Ce quartier est vraiment magnifique, j'espère revenir bientôt.", translation: "This neighbourhood is truly wonderful, I hope to come back soon." },
      { text: "Merci pour tout ! Cette semaine a vraiment changé mon rapport à la langue.", translation: "Thank you for everything! This week has truly changed my relationship with the language." },
    ],
    es: [
      { text: "¡Estoy tan contento de haber pasado esta semana aquí!", translation: "I'm so happy to have spent this week here!" },
      { text: "Este barrio es realmente maravilloso, espero volver pronto.", translation: "This neighbourhood is truly wonderful, I hope to come back soon." },
    ],
    it: [
      { text: "Sono così felice di aver trascorso questa settimana qui!", translation: "I'm so happy to have spent this week here!" },
      { text: "Questo quartiere è davvero meraviglioso, spero di tornare presto.", translation: "This neighbourhood is truly wonderful, I hope to come back soon." },
    ],
    en: [
      { text: "I'm so glad I spent this week here — it's been incredible!", translation: "I'm so glad I spent this week here — it's been incredible!" },
      { text: "This neighbourhood is truly wonderful. I hope to come back soon.", translation: "This neighbourhood is truly wonderful. I hope to come back soon." },
    ],
  },
  "d7-t3": {
    fr: [
      { text: "À très bientôt ! J'espère vous revoir la prochaine fois.", translation: "See you very soon! I hope to see you again next time." },
      { text: "Au revoir tout le monde ! Merci pour cette semaine inoubliable.", translation: "Goodbye everyone! Thank you for this unforgettable week." },
      { text: "Merci à tous ! Vous avez rendu cette expérience extraordinaire.", translation: "Thank you all! You made this experience extraordinary." },
    ],
    es: [
      { text: "¡Hasta muy pronto! Espero volver a veros la próxima vez.", translation: "See you very soon! I hope to see you all again next time." },
      { text: "¡Hasta luego a todos! Gracias por esta semana inolvidable.", translation: "Goodbye everyone! Thank you for this unforgettable week." },
    ],
    it: [
      { text: "A presto! Spero di rivedervi la prossima volta.", translation: "See you soon! I hope to see you all next time." },
      { text: "Arrivederci a tutti! Grazie per questa settimana indimenticabile.", translation: "Goodbye everyone! Thank you for this unforgettable week." },
    ],
    en: [
      { text: "Goodbye for now — I hope to see you all again soon!", translation: "Goodbye for now — I hope to see you all again soon!" },
      { text: "Thank you all for making this week so unforgettable!", translation: "Thank you all for making this week so unforgettable!" },
    ],
  },
};

export function getSuggestedResponses(taskId: string, targetLang: TargetLanguage): SuggestedResponse[] {
  if (SUGGESTED_RESPONSES_BY_TASK[taskId]?.[targetLang]) {
    return SUGGESTED_RESPONSES_BY_TASK[taskId][targetLang];
  }
  // Default fallback suggestions
  const defaults: Record<TargetLanguage, SuggestedResponse[]> = {
    fr: [
      { text: "Bonjour ! Comment allez-vous ?", translation: "Hello! How are you?" },
      { text: "Merci beaucoup pour votre aide !", translation: "Thank you very much for your help!" },
    ],
    es: [
      { text: "¡Hola! ¿Cómo estás?", translation: "Hello! How are you?" },
      { text: "¡Muchas gracias por su ayuda!", translation: "Thank you very much for your help!" },
    ],
    it: [
      { text: "Buongiorno! Come sta?", translation: "Good day! How are you?" },
      { text: "Grazie mille per l'aiuto!", translation: "Thank you so much for the help!" },
    ],
    en: [
      { text: "Hello! How are you doing?", translation: "Hello! How are you doing?" },
      { text: "Thank you very much for your help!", translation: "Thank you very much for your help!" },
    ],
  };
  return defaults[targetLang] || defaults.fr;
}

