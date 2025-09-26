import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Scale, Brain, User, FileText, Briefcase, Plus, Send, Copy, Download, Sparkles, Save, Share, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface QualificationGenerationProps {
  context?: {
    type: 'case' | 'document' | 'general';
    data?: any;
  };
  onNavigate?: (section: string, context?: any) => void;
  onGeneration?: (documentType: string) => void;
}

const translations = {
  en: {
    legalGeneration: 'Legal Generation',
    workingOn: 'Working on',
    newCase: 'New Case',
    aiLegalAssistant: 'AI Legal Assistant',
    active: 'Active',
    generatedDocument: 'Generated Document',
    noDocumentGenerated: 'No document generated yet',
    askAiToGenerate: 'Ask AI to generate legal documents',
    aiIsGenerating: 'AI is generating legal document...',
    copy: 'Copy',
    download: 'Download',
    save: 'Save',
    share: 'Share',
    print: 'Print',
    // AI Suggestions
    draftContract: 'Draft contract',
    generateBrief: 'Generate brief',
    analyzeCase: 'Analyze case',
    createLetter: 'Create letter',
    // Welcome messages
    welcomeGeneral: 'Welcome to AI Legal Generation! I can help you create professional legal documents, analyze cases, draft contracts, generate legal briefs, and provide expert legal guidance. What would you like me to help you with today?',
    welcomeCase: 'I can help you generate legal documents, analyze case details, create briefs, motions, and provide strategic legal advice for this case.',
    welcomeDocument: 'I can help you improve this document, generate related legal documents, create amendments, or draft supporting materials based on this document.',
    // Document types
    legalContract: 'Legal Contract',
    legalBrief: 'Legal Brief',
    legalAnalysis: 'Legal Analysis',
    legalLetter: 'Legal Letter',
    generalDocument: 'General Document',
    newDocument: 'New Document',
    caseAnalysis: 'Case Analysis',
    // Actions
    documentSaved: 'Document saved successfully!',
    documentShared: 'Document shared successfully!',
    linkCopied: 'Link copied to clipboard!',
    printStarted: 'Print started'
  },
  ru: {
    legalGeneration: 'Генерация Документов',
    workingOn: 'Работаем над',
    newCase: 'Новое Дело',
    aiLegalAssistant: 'ИИ Юридический Ассистент',
    active: 'Активен',
    generatedDocument: 'Сгенерированный Документ',
    noDocumentGenerated: 'Документ ещё не сгенерирован',
    askAiToGenerate: 'Попросите ИИ сгенерировать юридические документы',
    aiIsGenerating: 'ИИ генерирует юридический документ...',
    copy: 'Копировать',
    download: 'Скачать',
    save: 'Сохранить',
    share: 'Поделиться',
    print: 'Печать',
    // AI Suggestions
    draftContract: 'Составить договор',
    generateBrief: 'Создать справку',
    analyzeCase: 'Анализ дела',
    createLetter: 'Создать письмо',
    // Welcome messages
    welcomeGeneral: 'Добро пожаловать в ИИ Генерацию Документов! Я могу помочь создать профессиональные юридические документы, анализировать дела, составлять договоры, генерировать юридические справки и предоставлять экспертные юридические рекомендации. Чем могу помочь сегодня?',
    welcomeCase: 'Я могу помочь сгенерировать юридические документы, проанализировать детали дела, создать справки, ходатайства и предоставить стратегические юридические советы по этому делу.',
    welcomeDocument: 'Я могу помочь улучшить этот документ, сгенерировать связанные юридические документы, создать поправки или составить вспомогательные материалы на основе этого документа.',
    // Document types
    legalContract: 'Юридический Договор',
    legalBrief: 'Юридическая Справка',
    legalAnalysis: 'Правовой Анализ',
    legalLetter: 'Юридическое Письмо',
    generalDocument: 'Общий Документ',
    newDocument: 'Новый Документ',
    caseAnalysis: 'Анализ Дела',
    // Actions
    documentSaved: 'Документ успешно сохранен!',
    documentShared: 'Документ успешно отправлен!',
    linkCopied: 'Ссылка скопирована в буфер обмена!',
    printStarted: 'Печать начата'
  }
};

export default function QualificationGeneration({ context, onNavigate, onGeneration }: QualificationGenerationProps) {
  const { language } = useAuth();
  const t = translations[language];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');

  useEffect(() => {
    const getWelcomeMessage = () => {
      if (context?.type === 'case') {
        return `${t.welcomeCase}`;
      } else if (context?.type === 'document') {
        return `${t.welcomeDocument}`;
      } else {
        return t.welcomeGeneral;
      }
    };

    setMessages([{
      id: '1',
      text: getWelcomeMessage(),
      sender: 'ai',
      timestamp: new Date()
    }]);

    setGeneratedDocument('');
  }, [context, language, t]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      let aiResponseText = '';
      let documentType = t.generalDocument;
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes('договор') || lowerMessage.includes('contract') || lowerMessage.includes('соглашение')) {
        aiResponseText = language === 'ru'
          ? `Я составил комплексный юридический договор на основе ваших требований${context?.data?.name ? ` и контекста "${context.data.name}"` : ''}. Документ включает все необходимые правовые положения, условия и защитные пункты.`
          : `I've generated a comprehensive legal contract based on your requirements${context?.data?.name ? ` and the context of "${context.data.name}"` : ''}. The document includes all necessary legal provisions, terms and conditions, and protective clauses.`;
        setGeneratedDocument(generateContract());
        documentType = t.legalContract;
      } else if (lowerMessage.includes('справка') || lowerMessage.includes('brief') || lowerMessage.includes('ходатайство')) {
        aiResponseText = language === 'ru'
          ? `Я подготовил профессиональную юридическую справку${context?.type === 'case' ? ` для вашего дела "${context.data?.name || 'Анализ дела'}"` : ''}. Справка включает правовые аргументы, ссылки на дела и подтверждающие доказательства, структурированные для подачи в суд.`
          : `I've prepared a professional legal brief${context?.type === 'case' ? ` for your case "${context.data?.name || 'Case Analysis'}"` : ''}. The brief includes legal arguments, case citations, and supporting evidence structured for court submission.`;
        setGeneratedDocument(generateBrief());
        documentType = t.legalBrief;
      } else if (lowerMessage.includes('анализ') || lowerMessage.includes('analyze') || lowerMessage.includes('обзор')) {
        if (context?.type === 'case') {
          aiResponseText = language === 'ru'
            ? `Я провел тщательный анализ дела "${context.data?.name || 'Анализ дела'}". На основе деталей дела я выявил ключевые правовые вопросы, потенциальные стратегии и рекомендуемые следующие шаги.`
            : `I've conducted a thorough analysis of case "${context.data?.name || 'Case Analysis'}". Based on the case details, I've identified key legal issues, potential strategies, and recommended next steps.`;
        } else if (context?.type === 'document') {
          aiResponseText = language === 'ru'
            ? `Я проанализировал документ "${context.data?.name || 'Документ'}". Анализ охватывает правовое соответствие, потенциальные риски, предложения по улучшению и рекомендации по усовершенствованию.`
            : `I've analyzed the document "${context.data?.name || 'Document'}". The analysis covers legal compliance, potential risks, improvement suggestions, and recommendations for enhancement.`;
        } else {
          aiResponseText = language === 'ru'
            ? 'Я завершил правовой анализ. Обзор охватывает все соответствующие правовые аспекты, вопросы соответствия и стратегические рекомендации.'
            : `I've completed the legal analysis. The review covers all relevant legal aspects, compliance issues, and strategic recommendations.`;
        }
        setGeneratedDocument(generateAnalysis());
        documentType = t.legalAnalysis;
      } else if (lowerMessage.includes('письмо') || lowerMessage.includes('letter') || lowerMessage.includes('переписка')) {
        aiResponseText = language === 'ru'
          ? 'Я составил профессиональное юридическое письмо с правильным форматированием, юридической терминологией и убедительными аргументами. Письмо поддерживает профессиональный тон, четко излагая вашу позицию.'
          : `I've drafted a professional legal letter with proper formatting, legal language, and persuasive arguments. The letter maintains a professional tone while clearly stating your position.`;
        setGeneratedDocument(generateLetter());
        documentType = t.legalLetter;
      } else {
        aiResponseText = language === 'ru'
          ? `Я могу помочь с различными задачами генерации юридических документов${context?.data?.name ? ` связанными с "${context.data.name}"` : ''}. Могу создавать договоры, юридические справки, анализировать дела, составлять переписку или генерировать любые другие юридические документы. Какой конкретный юридический документ вы хотели бы создать?`
          : `I can help you with various legal document generation tasks${context?.data?.name ? ` related to "${context.data.name}"` : ''}. I can create contracts, legal briefs, analyze cases, draft correspondence, or generate any other legal documents you need. What specific legal document would you like me to create?`;
      }

      if (generatedDocument || lowerMessage.includes('договор') || lowerMessage.includes('справка') || lowerMessage.includes('анализ') || lowerMessage.includes('письмо') || 
          lowerMessage.includes('contract') || lowerMessage.includes('brief') || lowerMessage.includes('analyze') || lowerMessage.includes('letter')) {
        onGeneration?.(documentType);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2500);
  };

  const generateContract = () => {
    const contextInfo = context?.data?.name ? `\n// Сгенерировано в контексте: ${context.data.name}` : '';
    return language === 'ru' 
      ? `ДОГОВОР ОКАЗАНИЯ ЮРИДИЧЕСКИХ УСЛУГ${contextInfo}

Настоящий Договор заключен [ДАТА] между [ИМЯ КЛИЕНТА], [РЕГИОН] [ТИП СУБЪЕКТА] ("Клиент"), и [НАЗВАНИЕ ЮРИДИЧЕСКОЙ ФИРМЫ], профессиональная корпорация [РЕГИОНА] ("Юрист").

ВВОДНАЯ ЧАСТЬ
ПРИНИМАЯ ВО ВНИМАНИЕ, что Клиент желает удержать Юриста для оказания юридических услуг; и
ПРИНИМАЯ ВО ВНИМАНИЕ, что Юрист готов оказать такие услуги на условиях, изложенных ниже;

ТАКИМ ОБРАЗОМ, в соответствии со взаимными обязательствами, содержащимися в настоящем документе, стороны соглашаются:

1. ПРЕДМЕТ ЮРИДИЧЕСКИХ УСЛУГ
   Юрист обязуется оказать Клиенту следующие юридические услуги:
   а) Юридические консультации и стратегические советы
   б) Составление, рецензирование и пересмотр документов
   в) Правовые исследования и анализ дел
   г) Представительство в переговорах и судебных процессах
   д) Мониторинг соответствия и консультации

2. ПРОФЕССИОНАЛЬНЫЕ ГОНОРАРЫ И ОПЛАТА
   а) Почасовая ставка: [СТАВКА] тенге в час за работу юриста
   б) Периодичность выставления счетов: Ежемесячные отчеты
   в) Условия оплаты: Оплата в течение 30 дней с даты счета
   г) Авансовый платеж: [СУММА] тенге требуется при заключении
   д) Расходы: Клиент несет ответственность за разумные расходы

3. КОНФИДЕНЦИАЛЬНОСТЬ И ПРИВИЛЕГИЯ
   Юрист признает адвокатскую тайну и соглашается строго соблюдать конфиденциальность всей информации, документов и сообщений Клиента.

4. СРОК И РАСТОРЖЕНИЕ
   Настоящий Договор начинает действовать с [ДАТА] и продолжается до завершения услуг или расторжения любой из сторон с письменным уведомлением за 30 дней.

5. РАЗРЕШЕНИЕ СПОРОВ
   Любые споры разрешаются путем обязательного арбитража в [ЮРИСДИКЦИЯ] согласно правилам Арбитражной ассоциации.

6. ПРИМЕНИМОЕ ПРАВО
   Настоящий Договор регулируется законами Республики Казахстан.

В УДОСТОВЕРЕНИЕ ЧЕГО стороны подписали настоящий Договор в указанную выше дату.

КЛИЕНТ: _________________________     ЮРИСТ: _________________________
        [ИМЯ КЛИЕНТА]                            [ИМЯ ЮРИСТА]

Дата: _______________                  Дата: _______________

---
✓ ИИ-Сгенерированный Юридический Документ
✓ Комплексные Условия
✓ Профессиональная Юридическая Терминология
✓ Готов для Суда`
      : `LEGAL SERVICE AGREEMENT${contextInfo}

This Agreement is entered into on [DATE], between [CLIENT NAME], a [STATE] [ENTITY TYPE] ("Client"), and [LAW FIRM NAME], a [STATE] professional corporation ("Attorney").

RECITALS
WHEREAS, Client desires to retain Attorney to provide legal services; and
WHEREAS, Attorney is willing to provide such services under the terms set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SCOPE OF LEGAL SERVICES
   Attorney shall provide the following legal services to Client:
   a) Legal consultation and strategic advice
   b) Document drafting, review, and revision
   c) Legal research and case analysis
   d) Representation in negotiations and proceedings
   e) Compliance monitoring and guidance

2. PROFESSIONAL FEES AND BILLING
   a) Hourly Rate: $[RATE] per hour for attorney time
   b) Billing Frequency: Monthly statements
   c) Payment Terms: Net 30 days from invoice date
   d) Retainer: $[AMOUNT] required upon execution
   e) Expenses: Client responsible for reasonable costs

3. CONFIDENTIALITY AND PRIVILEGE
   Attorney acknowledges the attorney-client privilege and agrees to maintain strict confidentiality of all Client information, documents, and communications pursuant to applicable rules of professional conduct.

4. TERM AND TERMINATION
   This Agreement shall commence on [DATE] and continue until completion of services or termination by either party with 30 days written notice.

5. DISPUTE RESOLUTION
   Any disputes shall be resolved through binding arbitration in [JURISDICTION] under the rules of the American Arbitration Association.

6. GOVERNING LAW
   This Agreement shall be governed by the laws of [STATE].

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

CLIENT: _________________________     ATTORNEY: _________________________
        [CLIENT NAME]                            [ATTORNEY NAME]

Date: _______________                  Date: _______________

---
✓ AI-Generated Legal Document
✓ Comprehensive Terms and Conditions
✓ Professional Legal Language
✓ Court-Ready Format`;
  };

  const generateBrief = () => {
    const caseInfo = context?.type === 'case' && context.data?.name ? `\nПО ДЕЛУ: ${context.data.name}` : '';
    return language === 'ru' 
      ? `ЮРИДИЧЕСКАЯ СПРАВКА${caseInfo}

УВАЖАЕМОМУ СУДУ:

ВВЕДЕНИЕ
Настоящая справка подается в поддержку [ХОДАТАЙСТВА/ПОЗИЦИИ] по вышеуказанному делу. Факты и право четко поддерживают [ПОЗИЦИЮ КЛИЕНТА].

ИЗЛОЖЕНИЕ ФАКТОВ
${context?.type === 'case' ? `На основе деталей дела "${context.data?.name || 'Анализ дела'}", соответствующие факты следующие:` : 'Соответствующие факты следующие:'}

1. [ФАКТ ПЕРВЫЙ С ПОДТВЕРЖДАЮЩИМИ ДОКАЗАТЕЛЬСТВАМИ]
2. [ФАКТ ВТОРОЙ С ПОДТВЕРЖДАЮЩИМИ ДОКАЗАТЕЛЬСТВАМИ]
3. [ФАКТ ТРЕТИЙ С ПОДТВЕРЖДАЮЩИМИ ДОКАЗАТЕЛЬСТВАМИ]

ПРАВОВАЯ АРГУМЕНТАЦИЯ

I. ПРИМЕНИМЫЙ ПРАВОВОЙ СТАНДАРТ
Суд должен применить стандарт, установленный в [СООТВЕТСТВУЮЩАЯ СУДЕБНАЯ ПРАКТИКА]. Этот стандарт требует [ПРАВОВЫЕ ТРЕБОВАНИЯ].

II. ПРИМЕНЕНИЕ ПРАВА К ФАКТАМ
А. [ПЕРВЫЙ ПРАВОВОЙ АРГУМЕНТ]
   Доказательства демонстрируют, что [ПОДТВЕРЖДАЮЩИЙ АРГУМЕНТ]. Это соответствует решению в [ССЫЛКА НА ДЕЛО], где суд установил [СООТВЕТСТВУЮЩЕЕ РЕШЕНИЕ].

Б. [ВТОРОЙ ПРАВОВОЙ АРГУМЕНТ]
   Кроме того, [ДОПОЛНИТЕЛЬНЫЙ АРГУМЕНТ]. Как указано в [ССЫЛКА НА ДЕЛО], "[СООТВЕТСТВУЮЩАЯ ЦИТАТА]."

В. [ТРЕТИЙ ПРАВОВОЙ АРГУМЕНТ]
   Наконец, [ЗАКЛЮЧИТЕЛЬНЫЙ АРГУМЕНТ]. Прецедент, установленный в [ССЫЛКА НА ДЕЛО], прямо поддерживает эту позицию.

ЗАКЛЮЧЕНИЕ
По вышеизложенным причинам настоящий Суд должен [ЗАПРАШИВАЕМОЕ РЕШЕНИЕ]. Доказательства и применимое право четко поддерживают [ПОЗИЦИЮ КЛИЕНТА].

С уважением,

_________________________
[ИМЯ ЮРИСТА]
[НОМЕР АДВОКАТСКОГО УДОСТОВЕРЕНИЯ]
Адвокат для [КЛИЕНТА]
[НАЗВАНИЕ ФИРМЫ]
[АДРЕС]
[ТЕЛЕФОН/EMAIL]

---
✓ Профессиональный Формат Юридической Справки
✓ Структурированные Правовые Аргументы
✓ Ссылки на Дела и Прецеденты
✓ Готово для Подачи в Суд`
      : `LEGAL BRIEF${caseInfo}

TO THE HONORABLE COURT:

INTRODUCTION
This brief is submitted in support of [MOTION/POSITION] in the above-captioned matter. The facts and law clearly support [CLIENT'S POSITION].

STATEMENT OF FACTS
${context?.type === 'case' ? `Based on the case details of "${context.data?.name || 'Case Analysis'}", the following facts are relevant:` : 'The relevant facts are as follows:'}

1. [FACT ONE WITH SUPPORTING EVIDENCE]
2. [FACT TWO WITH SUPPORTING EVIDENCE]
3. [FACT THREE WITH SUPPORTING EVIDENCE]

LEGAL ARGUMENT

I. THE APPLICABLE LEGAL STANDARD
The court should apply the standard set forth in [RELEVANT CASE LAW]. This standard requires [LEGAL REQUIREMENTS].

II. APPLICATION OF LAW TO FACTS
A. [FIRST LEGAL ARGUMENT]
   The evidence demonstrates that [SUPPORTING ARGUMENT]. This is consistent with the holding in [CASE CITATION], where the court found [RELEVANT HOLDING].

B. [SECOND LEGAL ARGUMENT]
   Furthermore, [ADDITIONAL ARGUMENT]. As stated in [CASE CITATION], "[RELEVANT QUOTE]."

C. [THIRD LEGAL ARGUMENT]
   Finally, [CONCLUDING ARGUMENT]. The precedent established in [CASE CITATION] directly supports this position.

CONCLUSION
For the foregoing reasons, this Court should [REQUESTED RELIEF]. The evidence and applicable law clearly support [CLIENT'S POSITION].

Respectfully submitted,

_________________________
[ATTORNEY NAME]
[BAR NUMBER]
Attorney for [CLIENT]
[FIRM NAME]
[ADDRESS]
[PHONE/EMAIL]

---
✓ Professional Legal Brief Format
✓ Structured Legal Arguments
✓ Case Citations and References
✓ Court Submission Ready`;
  };

  const generateAnalysis = () => {
    const analysisSubject = context?.data?.name || 'Правовой вопрос';
    return language === 'ru' 
      ? `ОТЧЕТ О ПРАВОВОМ АНАЛИЗЕ
${context?.type === 'case' ? 'ДЕЛО' : 'ДОКУМЕНТ'}: ${analysisSubject}

КРАТКОЕ РЕЗЮМЕ
Данный анализ предоставляет комплексный обзор ${analysisSubject}, исследуя ключевые правовые вопросы, потенциальные риски и стратегические рекомендации.

${context?.type === 'case' ? 'ОБЗОР ДЕЛА' : 'ОБЗОР ДОКУМЕНТА'}
${context?.type === 'case' 
  ? `Название дела: ${analysisSubject}
Тип дела: ${context.data?.type || 'Общий правовой вопрос'}
Текущий статус: Активный обзор
Ключевые вопросы: [ВЫЯВЛЕННЫЕ ПРАВОВЫЕ ВОПРОСЫ]`
  : `Документ: ${analysisSubject}
Тип документа: ${context.data?.type || 'Юридический документ'}
Дата обзора: ${new Date().toLocaleDateString('ru-RU')}
Область анализа: Комплексный правовой обзор`}

КЛЮЧЕВЫЕ ВЫВОДЫ
1. ПРАВОВОЕ СООТВЕТСТВИЕ
   ✓ Структура документа соответствует правовым требованиям
   ⚠ Выявлены незначительные проблемы соответствия в [РАЗДЕЛ]
   ✓ Использована правильная юридическая терминология

2. ОЦЕНКА РИСКОВ
   • НИЗКИЙ РИСК: Стандартные положения адекватно защищают интересы
   • СРЕДНИЙ РИСК: [КОНКРЕТНАЯ ОБЛАСТЬ РИСКА] требует внимания
   • ВЫСОКИЙ РИСК: [КРИТИЧЕСКАЯ ПРОБЛЕМА] нуждается в немедленном решении

3. СТРАТЕГИЧЕСКИЕ СООБРАЖЕНИЯ
   • Возможность укрепить позицию через [СТРАТЕГИЯ]
   • Рассмотреть дополнительные положения для [ЗАЩИТА]
   • Временные соображения: [СРОКИ/ЭТАПЫ]

РЕКОМЕНДАЦИИ
НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ:
1. [ПРИОРИТЕТНАЯ РЕКОМЕНДАЦИЯ]
2. [ВТОРИЧНАЯ РЕКОМЕНДАЦИЯ]
3. [ТРЕБОВАНИЕ СООТВЕТСТВИЯ]

ДОЛГОСРОЧНАЯ СТРАТЕГИЯ:
• [СТРАТЕГИЧЕСКАЯ РЕКОМЕНДАЦИЯ]
• [ПРЕВЕНТИВНАЯ МЕРА]
• [БУДУЩИЕ СООБРАЖЕНИЯ]

ЗАКЛЮЧЕНИЕ
${context?.type === 'case' 
  ? `Дело "${analysisSubject}" представляет управляемые правовые проблемы с хорошими перспективами для благоприятного решения. Реализация рекомендуемых стратегий значительно укрепит правовую позицию.`
  : `Документ "${analysisSubject}" в целом надежен, но выиграет от выявленных улучшений. Рекомендуемые изменения усилят правовую защиту и исполнимость.`}

Следующие шаги: Запланировать консультацию для обсуждения реализации рекомендаций.

---
✓ Комплексный правовой анализ
✓ Оценка и смягчение рисков
✓ Стратегические рекомендации
✓ Действенные следующие шаги`
      : `LEGAL ANALYSIS REPORT
${context?.type === 'case' ? 'CASE' : 'DOCUMENT'}: ${analysisSubject}

EXECUTIVE SUMMARY
This analysis provides a comprehensive review of ${analysisSubject}, examining key legal issues, potential risks, and strategic recommendations.

${context?.type === 'case' ? 'CASE OVERVIEW' : 'DOCUMENT OVERVIEW'}
${context?.type === 'case' 
  ? `Case Name: ${analysisSubject}
Case Type: ${context.data?.type || 'General Legal Matter'}
Current Status: Active Review
Key Issues: [IDENTIFIED LEGAL ISSUES]`
  : `Document: ${analysisSubject}
Document Type: ${context.data?.type || 'Legal Document'}
Review Date: ${new Date().toLocaleDateString()}
Analysis Scope: Comprehensive Legal Review`}

KEY FINDINGS
1. LEGAL COMPLIANCE
   ✓ Document structure meets legal requirements
   ⚠ Minor compliance issues identified in [SECTION]
   ✓ Proper legal language and terminology used

2. RISK ASSESSMENT
   • LOW RISK: Standard provisions adequately protect interests
   • MEDIUM RISK: [SPECIFIC RISK AREA] requires attention
   • HIGH RISK: [CRITICAL ISSUE] needs immediate resolution

3. STRATEGIC CONSIDERATIONS
   • Opportunity to strengthen position through [STRATEGY]
   • Consider additional provisions for [PROTECTION]
   • Timeline considerations: [DEADLINES/MILESTONES]

RECOMMENDATIONS
IMMEDIATE ACTIONS:
1. [PRIORITY RECOMMENDATION]
2. [SECONDARY RECOMMENDATION]
3. [COMPLIANCE REQUIREMENT]

LONG-TERM STRATEGY:
• [STRATEGIC RECOMMENDATION]
• [PREVENTIVE MEASURE]
• [FUTURE CONSIDERATIONS]

CONCLUSION
${context?.type === 'case' 
  ? `The case "${analysisSubject}" presents manageable legal challenges with strong prospects for favorable resolution. Implementation of the recommended strategies will significantly strengthen the legal position.`
  : `The document "${analysisSubject}" is generally sound but would benefit from the identified improvements. The recommended changes will enhance legal protection and enforceability.`}

Next Steps: Schedule consultation to discuss implementation of recommendations.

---
✓ Comprehensive Legal Analysis
✓ Risk Assessment and Mitigation
✓ Strategic Recommendations
✓ Actionable Next Steps`;
  };

  const generateLetter = () => {
    return language === 'ru' 
      ? `[БЛАНК ЮРИДИЧЕСКОЙ ФИРМЫ]

[ДАТА]

[ИМЯ ПОЛУЧАТЕЛЯ]
[ДОЛЖНОСТЬ]
[КОМПАНИЯ/ОРГАНИЗАЦИЯ]
[АДРЕС]

Касательно: ${context?.data?.name || 'Правовой вопрос'}

Уважаемый(ая) [ИМЯ ПОЛУЧАТЕЛЯ],

Обращаюсь к Вам от имени моего клиента, [ИМЯ КЛИЕНТА], относительно [ПРЕДМЕТ ПИСЬМА]. Настоящее письмо служит официальным уведомлением Вас о [ЦЕЛЬ ПИСЬМА] и излагает позицию нашего клиента по данному вопросу.

ПРЕДЫСТОРИЯ
[ФАКТИЧЕСКАЯ ПРЕДЫСТОРИЯ, ОТНОСЯЩАЯСЯ К ВОПРОСУ]

ПРАВОВАЯ ПОЗИЦИЯ
Позиция нашего клиента поддерживается [ПРАВОВАЯ ОСНОВА]. Конкретно, [ДЕТАЛЬНАЯ ПРАВОВАЯ АРГУМЕНТАЦИЯ]. Применимое право четко устанавливает [ПРАВОВОЙ ПРИНЦИП].

ЗАПРАШИВАЕМЫЕ ДЕЙСТВИЯ
Мы с уважением просим Вас:
1. [КОНКРЕТНАЯ ПРОСЬБА ПЕРВАЯ]
2. [КОНКРЕТНАЯ ПРОСЬБА ВТОРАЯ]
3. [КОНКРЕТНАЯ ПРОСЬБА ТРЕТЬЯ]

Пожалуйста, подтвердите получение настоящего письма и сообщите нам о Вашей позиции по данному вопросу в течение [ВРЕМЕННЫЕ РАМКИ]. Мы считаем, что данный вопрос может быть решен полюбовно и ожидаем Вашего ответа.

Если у Вас есть вопросы или Вы хотите обсудить данный вопрос дополнительно, пожалуйста, не стесняйтесь обращаться ко мне по телефону [ТЕЛЕФОН] или электронной почте [EMAIL].

Благодарю за ожидаемое сотрудничество.

С уважением,

[ИМЯ ЮРИСТА]
[ДОЛЖНОСТЬ]
[НОМЕР АДВОКАТСКОГО УДОСТОВЕРЕНИЯ]
Адвокат для [ИМЯ КЛИЕНТА]

копия: [ИМЯ КЛИЕНТА]

---
✓ Профессиональная юридическая переписка
✓ Четкое изложение позиции
✓ Формальная юридическая терминология
✓ Правильный формат письма`
      : `[LAW FIRM LETTERHEAD]

[DATE]

[RECIPIENT NAME]
[TITLE]
[COMPANY/ORGANIZATION]
[ADDRESS]

Re: ${context?.data?.name || 'Legal Matter'}

Dear [RECIPIENT NAME]:

I am writing on behalf of my client, [CLIENT NAME], regarding [SUBJECT MATTER]. This letter serves to formally notify you of [PURPOSE OF LETTER] and to outline our client's position on this matter.

BACKGROUND
[FACTUAL BACKGROUND RELEVANT TO THE MATTER]

LEGAL POSITION
Our client's position is supported by [LEGAL BASIS]. Specifically, [DETAILED LEGAL ARGUMENT]. The applicable law clearly establishes [LEGAL PRINCIPLE].

REQUESTED ACTION
We respectfully request that you:
1. [SPECIFIC REQUEST ONE]
2. [SPECIFIC REQUEST TWO]
3. [SPECIFIC REQUEST THREE]

Please confirm your receipt of this letter and advise us of your position on this matter within [TIMEFRAME]. We believe this matter can be resolved amicably and look forward to your response.

If you have any questions or wish to discuss this matter further, please do not hesitate to contact me at [PHONE] or [EMAIL].

Thank you for your anticipated cooperation.

Very truly yours,

[ATTORNEY NAME]
[TITLE]
[BAR NUMBER]
Attorney for [CLIENT NAME]

cc: [CLIENT NAME]

---
✓ Professional Legal Correspondence
✓ Clear Statement of Position
✓ Formal Legal Language
✓ Proper Letter Format`;
  };

  const getContextualSuggestions = () => {
    if (context?.type === 'case') {
      return [t.generateBrief, t.analyzeCase, t.draftContract, t.createLetter];
    } else if (context?.type === 'document') {
      return [language === 'ru' ? 'Улучшить документ' : 'Improve document', 
              language === 'ru' ? 'Создать поправку' : 'Generate amendment', 
              t.draftContract, t.createLetter];
    } else {
      return [t.draftContract, t.generateBrief, t.analyzeCase, t.createLetter];
    }
  };

  const handleCopyDocument = () => {
    navigator.clipboard.writeText(generatedDocument);
    alert(t.linkCopied);
  };

  const handleSaveDocument = () => {
    // Simulate save
    alert(t.documentSaved);
  };

  const handleShareDocument = () => {
    // Simulate share
    alert(t.documentShared);
  };

  const handleDownloadDocument = () => {
    // Create and trigger download
    const element = document.createElement('a');
    const file = new Blob([generatedDocument], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'legal-document.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintDocument = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Legal Document</title></head>
          <body><pre>${generatedDocument}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    alert(t.printStarted);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scale className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-3xl text-ttc-gradient">{t.legalGeneration}</h1>
            {context?.data?.name && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{t.workingOn}:</span>
                <Badge variant="outline" className="gap-1">
                  {context.type === 'case' ? <Briefcase className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  {context.data.name}
                </Badge>
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={() => onNavigate?.('cases')}>
          <Plus className="w-4 h-4 mr-2" />
          {t.newCase}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 h-[700px] flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center"
              >
                <Brain className="w-4 h-4 text-white" />
              </motion.div>
              <h3>{t.aiLegalAssistant}</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                ● {t.active}
              </Badge>
            </div>
            
            <div className="flex-1 bg-muted/20 rounded-lg p-4 overflow-y-auto mb-4">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded text-sm ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-6' 
                        : 'bg-secondary mr-6'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && (
                        <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-secondary mr-6 p-3 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-4 h-4" />
                      </motion.div>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                      <span>{t.aiIsGenerating}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <Input
                placeholder={`${t.askAiToGenerate}${context?.data?.name ? ` для "${context.data.name}"` : ''}...`}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!currentMessage.trim() || isProcessing}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {getContextualSuggestions().map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setCurrentMessage(suggestion)}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {suggestion}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-[700px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3>{t.generatedDocument}</h3>
              {generatedDocument && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyDocument}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t.copy}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveDocument}>
                    <Save className="w-4 h-4 mr-2" />
                    {t.save}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadDocument}>
                    <Download className="w-4 h-4 mr-2" />
                    {t.download}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareDocument}>
                    <Share className="w-4 h-4 mr-2" />  
                    {t.share}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrintDocument}>
                    <Printer className="w-4 h-4 mr-2" />
                    {t.print}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex-1 bg-muted/20 rounded-lg p-4 overflow-y-auto">
              {generatedDocument ? (
                <motion.pre 
                  className="text-sm whitespace-pre-wrap font-mono leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {generatedDocument}
                </motion.pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <motion.div
                    animate={{ bounce: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FileText className="w-16 h-16 mb-4" />
                  </motion.div>
                  <p className="text-lg mb-2">{t.noDocumentGenerated}</p>
                  <p className="text-sm">
                    {context?.data?.name 
                      ? `${t.askAiToGenerate} "${context.data.name}"`
                      : t.askAiToGenerate
                    }
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}