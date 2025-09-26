import { CaseData } from './constants';

export const mockCasesData: CaseData[] = [
  {
    id: 'case-001',
    fio: 'Нурланов Асылбек Болатұлы',
    patronymic: 'Болатұлы',
    iin: '820315301456',
    organization: 'ТОО "Казахстан Бизнес Астана"',
    investigator: 'Ахметов Серик Нурланович',
    registration_date: new Date(2024, 0, 15),
    qualification: 'Мошенничество группой лиц в особо крупном размере (ч.4 ст. 190 УК РК)',
    damage_amount: 125000000,
    income_amount: 45000000,
    indictment_date: new Date(2024, 1, 28),
    created_at: new Date(2024, 0, 10),
    updated_at: new Date(2024, 2, 5),
    // Legacy fields
    name: 'Уголовное дело №1-45/2024',
    type: 'Экономическое преступление',
    status: 'Active',
    client: 'Нурланов Асылбек Болатұлы',
    priority: 'High',
    deadline: '2024-06-15',
    description: 'Уголовное дело по факту мошенничества при реализации государственных программ в сфере жилищного строительства. Обвиняемый, используя подложные документы, завладел бюджетными средствами на сумму свыше 125 млн тенге.',
    generatedFiles: [
      { id: 'doc-1', name: 'Обвинительный акт.pdf', type: 'Процессуальный документ', generatedAt: new Date(2024, 0, 15), size: '2.1 MB' },
      { id: 'doc-2', name: 'Ходатайство об избрании меры пресечения.pdf', type: 'Ходатайство', generatedAt: new Date(2024, 0, 18), size: '1.2 MB' },
      { id: 'doc-3', name: 'Заключение экономической экспертизы.pdf', type: 'Экспертиза', generatedAt: new Date(2024, 0, 25), size: '3.8 MB' }
    ],
    documents: []
  },
  {
    id: 'case-002',
    fio: 'Садыкова Гульнара Маратовна',
    patronymic: 'Маратовна',
    iin: '750628401589',
    organization: 'АО "Медицинский центр Алматы"',
    investigator: 'Жумабеков Алтынбек Кайратович',
    registration_date: new Date(2024, 0, 22),
    qualification: 'Присвоение и растрата вверенного имущества в крупном размере (ч.3 ст. 189 УК РК)',
    damage_amount: 89500000,
    income_amount: 25600000,
    indictment_date: new Date(2024, 2, 12),
    created_at: new Date(2024, 0, 18),
    updated_at: new Date(2024, 2, 15),
    // Legacy fields
    name: 'Уголовное дело №1-67/2024',
    type: 'Хищение государственного имущества',
    status: 'In Review',
    client: 'Садыкова Гульнара Маратовна',
    priority: 'High',
    deadline: '2024-07-20',
    description: 'Дело о присвоении бюджетных средств, выделенных на закупку медицинского оборудования. Подозреваемая, занимая должность заместителя главного врача по снабжению, систематически завышала стоимость закупаемого оборудования и присваивала разницу.',
    generatedFiles: [
      { id: 'doc-4', name: 'Протокол допроса обвиняемой.pdf', type: 'Протокол', generatedAt: new Date(2024, 1, 15), size: '1.8 MB' },
      { id: 'doc-5', name: 'Постановление о назначении экспертизы.pdf', type: 'Постановление', generatedAt: new Date(2024, 1, 22), size: '956 KB' }
    ],
    documents: []
  },
  {
    id: 'case-003',
    fio: 'Абдрахманов Максат Ерланович',
    patronymic: 'Ерланович',
    iin: '881203502347',
    organization: 'ИП "Абдрахманов Максат"',
    investigator: 'Касымова Алия Болатқызы',
    registration_date: new Date(2024, 1, 8),
    qualification: 'Уклонение от уплаты налогов в особо крупном размере (ч.3 ст. 231 УК РК)',
    damage_amount: 67800000,
    income_amount: 156000000,
    indictment_date: new Date(2024, 2, 20),
    created_at: new Date(2024, 1, 5),
    updated_at: new Date(2024, 2, 25),
    // Legacy fields
    name: 'Уголовное дело №1-89/2024',
    type: 'Налоговое преступление',
    status: 'Pending',
    client: 'Абдрахманов Максат Ерланович',
    priority: 'Medium',
    deadline: '2024-08-10',
    description: 'Уголовное дело по факту систематического уклонения от уплаты налогов путем ведения двойной отчетности. Установлено сокрытие доходов от предпринимательской деятельности на сумму свыше 156 млн тенге за период 2020-2023 гг.',
    generatedFiles: [
      { id: 'doc-6', name: 'Справка налогового органа о задолженности.pdf', type: 'Справка', generatedAt: new Date(2024, 2, 10), size: '1.4 MB' },
      { id: 'doc-7', name: 'Расчет пеней и штрафов.pdf', type: 'Расчет', generatedAt: new Date(2024, 2, 15), size: '890 KB' }
    ],
    documents: []
  },
  {
    id: 'case-004',
    fio: 'Конаев Нурболат Серикович',
    patronymic: 'Серикович',
    iin: '780908123789',
    organization: 'ТОО "Construction Group"',
    investigator: 'Рысбеков Мурат Талгатович',
    registration_date: new Date(2024, 2, 3),
    qualification: 'Получение взятки должностным лицом в особо крупном размере (ч.3 ст. 366 УК РК)',
    damage_amount: 95000000,
    income_amount: 35000000,
    indictment_date: new Date(2024, 3, 15),
    created_at: new Date(2024, 2, 1),
    updated_at: new Date(2024, 3, 20),
    // Legacy fields
    name: 'Уголовное дело №1-123/2024',
    type: 'Коррупционное преступление',
    status: 'Active',
    client: 'Конаев Нурболат Серикович',
    priority: 'High',
    deadline: '2024-09-15',
    description: 'Дело о получении взяток главным архитектором города за ускорение согласования проектной документации крупных строительных объектов. Общая сумма полученных взяток составила 95 млн тенге.',
    generatedFiles: [
      { id: 'doc-8', name: 'Протокол задержания с поличным.pdf', type: 'Протокол', generatedAt: new Date(2024, 2, 15), size: '2.3 MB' },
      { id: 'doc-9', name: 'Обыскные документы и изъятые предметы.pdf', type: 'Протокол', generatedAt: new Date(2024, 2, 18), size: '3.1 MB' }
    ],
    documents: []
  },
  {
    id: 'case-005',
    fio: 'Калиева Айнур Бахытжановна',
    patronymic: 'Бахытжановна',
    iin: '851127654321',
    organization: 'АО "QazaqGas Distribution"',
    investigator: 'Омарова Карлыгаш Нуржановна',
    registration_date: new Date(2024, 1, 20),
    qualification: 'Злоупотребление должностными полномочиями, повлекшее тяжкие последствия (ч.2 ст. 307 УК РК)',
    damage_amount: 180000000,
    income_amount: 45000000,
    indictment_date: new Date(2024, 3, 5),
    created_at: new Date(2024, 1, 18),
    updated_at: new Date(2024, 3, 10),
    // Legacy fields
    name: 'Уголовное дело №1-98/2024',
    type: 'Должностное преступление',
    status: 'In Review',
    client: 'Калиева Айнур Бахытжановна',
    priority: 'Medium',
    deadline: '2024-08-05',
    description: 'Дело о злоупотребление должностными полномочиями начальника отдела закупок АО "QazaqGas Distribution". Заключение фиктивных договоров на поставку газового оборудования привело к ущербу в размере 180 млн тенге.',
    generatedFiles: [
      { id: 'doc-10', name: 'Заключение технической экспертизы.pdf', type: 'Экспертиза', generatedAt: new Date(2024, 3, 1), size: '4.2 MB' },
      { id: 'doc-11', name: 'Анализ финансовых операций.pdf', type: 'Справка', generatedAt: new Date(2024, 3, 5), size: '2.8 MB' }
    ],
    documents: []
  },
  {
    id: 'case-006',
    fio: 'Смагулов Ерлан Қуатович',
    patronymic: 'Қуатович',
    iin: '901215987654',
    organization: 'ТОО "Mining Solutions KZ"',
    investigator: 'Дауренбеков Асхат Ерболович',
    registration_date: new Date(2024, 3, 12),
    qualification: 'Незаконное предпринимательство в особо крупном размере (ч.2 ст. 190-1 УК РК)',
    damage_amount: 240000000,
    income_amount: 89000000,
    indictment_date: new Date(2024, 4, 25),
    created_at: new Date(2024, 3, 10),
    updated_at: new Date(2024, 4, 28),
    // Legacy fields
    name: 'Уголовное дело №1-156/2024',
    type: 'Экономическое преступление',
    status: 'Pending',
    client: 'Смагулов Ерлан Қуатович',
    priority: 'High',
    deadline: '2024-10-25',
    description: 'Дело о незаконной добыче и реализации полезных ископаемых без соответствующих лицензий. Организованная группа под руководством Смагулова осуществляла незаконную добычу золота в течение 3 лет.',
    generatedFiles: [
      { id: 'doc-12', name: 'Геологическая экспертиза месторождения.pdf', type: 'Экспертиза', generatedAt: new Date(2024, 4, 15), size: '5.6 MB' },
      { id: 'doc-13', name: 'Протоколы изъятия оборудования.pdf', type: 'Протокол', generatedAt: new Date(2024, 4, 20), size: '3.3 MB' }
    ],
    documents: []
  },
  {
    id: 'case-007',
    fio: 'Жанібеков Арман Ғалымович',
    patronymic: 'Ғалымович',
    iin: '730825456789',
    organization: 'ГУ "Областной центр молодежных программ"',
    investigator: 'Сарсенова Гүлжан Мұратқызы',
    registration_date: new Date(2024, 0, 28),
    qualification: 'Растрата вверенного имущества группой лиц (ч.2 ст. 189 УК РК)',
    damage_amount: 45000000,
    income_amount: 15000000,
    indictment_date: new Date(2024, 2, 18),
    created_at: new Date(2024, 0, 25),
    updated_at: new Date(2024, 2, 22),
    // Legacy fields
    name: 'Уголовное дело №1-78/2024',
    type: 'Хищение бюджетных средств',
    status: 'Active',
    client: 'Жанібеков Арман Ғалымович',
    priority: 'Medium',
    deadline: '2024-07-18',
    description: 'Растрата бюджетных средств, выделенных на реализацию молодежных программ. Руководство центра создавало фиктивные мероприятия и присваивало выделенные средства.',
    generatedFiles: [
      { id: 'doc-14', name: 'Акт ревизии финансово-хозяйственной деятельности.pdf', type: 'Справка', generatedAt: new Date(2024, 2, 10), size: '3.7 MB' },
      { id: 'doc-15', name: 'Показания свидетелей-сотрудников.pdf', type: 'Протокол', generatedAt: new Date(2024, 2, 15), size: '2.1 MB' }
    ],
    documents: []
  }
];

export const mockDocuments = [
  { 
    id: '1', 
    name: 'Обвинительный акт по ст. 190 УК РК.pdf', 
    type: 'PDF', 
    size: '3.2 MB', 
    modified: '1 день назад', 
    content: `ОБВИНИТЕЛЬНЫЙ АКТ по уголовному делу № 1-45/2024...` 
  },
  { 
    id: '2', 
    name: 'Постановление о применении меры пресечения.pdf', 
    type: 'PDF', 
    size: '1.8 MB', 
    modified: '3 дня назад', 
    content: `ПОСТАНОВЛЕНИЕ о применении меры пресечения...` 
  },
  { 
    id: '3', 
    name: 'Заключение экономической экспертизы.pdf', 
    type: 'PDF', 
    size: '4.5 MB', 
    modified: '1 неделю назад', 
    content: `ЗАКЛЮЧЕНИЕ судебной экономической экспертизы...` 
  },
  { 
    id: '4', 
    name: 'Протокол допроса обвиняемого.pdf', 
    type: 'PDF', 
    size: '2.1 MB', 
    modified: '4 дня назад', 
    content: `ПРОТОКОЛ ДОПРОСА ОБВИНЯЕМОГО...` 
  },
];

export const getTypeFromQualification = (qualification: string): string => {
  if (qualification.includes('190') || qualification.includes('мошенничество')) return 'Экономическое преступление';
  if (qualification.includes('189') || qualification.includes('присвоение')) return 'Хищение государственного имущества';
  if (qualification.includes('231') || qualification.includes('налог')) return 'Налоговое преступление';
  if (qualification.includes('366') || qualification.includes('взятк')) return 'Коррупционное преступление';
  return 'Уголовное дело';
};