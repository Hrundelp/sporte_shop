/**
 * products.js — единый источник данных о товарах
 * Подключается перед catalog.html и product.html
 * Зависит от: ничего (чистый JS, без зависимостей)
 */

const PRODUCTS = [
    // ── БОКС
    {
        id: 'gloves-1',
        name: 'Боксерские перчатки Twins Special FBGVL3-55',
        category: 'boxing',
        price: 6200,
        oldPrice: 8760,
        discount: 40,
        image: 'assets/images/перчатки.jpg',
        images: ['assets/images/перчатки.jpg', 'assets/images/Лапы.jpg', 'assets/images/боксерки.jpg'],
        inStock: true,
        description: 'Профессиональные боксёрские перчатки Twins Special — выбор чемпионов. Изготовлены из натуральной кожи высшего сорта с многослойной пенной набивкой. Обеспечивают максимальную защиту суставов и идеальную посадку руки. Подходят для тренировок, спарринга и соревнований.',
        specs: [
            { label: 'Вес',         value: '12 унций' },
            { label: 'Материал',    value: 'Натуральная кожа' },
            { label: 'Набивка',     value: 'Многослойный пенополиуретан' },
            { label: 'Застёжка',    value: 'На липучке (велкро)' },
            { label: 'Цвет',        value: 'Красный / чёрный' },
            { label: 'Страна',      value: 'Таиланд' },
            { label: 'Применение',  value: 'Тренировки, спарринг, соревнования' },
        ],
        reviewsList: [
            { author: 'Алексей К.', rating: 5, date: '2026-01-15', text: 'Отличные перчатки, брал для спарринга. Кожа мягкая, набивка плотная — руки не устают даже после длительных тренировок.' },
            { author: 'Марина В.', rating: 5, date: '2026-02-03', text: 'Купила мужу на день рождения. Очень доволен, говорит что лучшие перчатки из всех что пробовал.' },
            { author: 'Дмитрий Р.', rating: 4, date: '2026-03-10', text: 'Качество на высоте, но липучка немного тугая первое время. После нескольких тренировок разносилась.' },
        ],
        rating: 5,
        reviews: 88
    },
    {
        id: 'boots-1',
        name: 'Боксерки GRAWA',
        category: 'boxing',
        price: 3300,
        oldPrice: 4200,
        discount: 35,
        image: 'assets/images/боксерки.jpg',
        images: ['assets/images/боксерки.jpg', 'assets/images/перчатки.jpg'],
        inStock: true,
        description: 'Лёгкие и прочные боксёрки GRAWA с замшевой подошвой обеспечивают отличное сцепление с покрытием ринга. Высокий крой надёжно фиксирует голеностоп, предотвращая травмы. Подходят как для тренировочного зала, так и для соревнований.',
        specs: [
            { label: 'Размеры',           value: '36–46' },
            { label: 'Подошва',           value: 'Натуральная замша' },
            { label: 'Верх',              value: 'Синтетическая кожа' },
            { label: 'Высота голенища',   value: 'Средняя' },
            { label: 'Застёжка',          value: 'Шнуровка + молния' },
            { label: 'Вес пары',          value: '320 г' },
        ],
        rating: 4,
        reviews: 28
    },
    {
        id: 'pads-1',
        name: 'Лапы боксерские для тренировки',
        category: 'boxing',
        price: 1100,
        oldPrice: 1600,
        discount: 30,
        image: 'assets/images/Лапы.jpg',
        images: ['assets/images/Лапы.jpg', 'assets/images/перчатки.jpg'],
        inStock: true,
        description: 'Надёжные боксёрские лапы с анатомической формой кисти. Пенополиуретановая набивка гасит удар, снижая нагрузку на руку тренера. Рукоятка фиксирует руку в правильном положении. Подходят для отработки прямых, боковых и апперкотов.',
        specs: [
            { label: 'Набивка',              value: 'Пенополиуретан высокой плотности' },
            { label: 'Материал',             value: 'Экокожа' },
            { label: 'Ударная поверхность',  value: '22 × 16 см' },
            { label: 'Рукоятка',             value: 'Анатомическая, регулируемая' },
            { label: 'Вес пары',             value: '480 г' },
        ],
        reviewsList: [
            { author: 'Тренер Игорь', rating: 5, date: '2026-01-20', text: 'Работаю с этими лапами уже три месяца — отличная амортизация, рука не устаёт. Ученики тоже довольны.' },
            { author: 'Кирилл С.', rating: 5, date: '2026-02-14', text: 'Взял для домашних тренировок с братом. Держат удар хорошо, не деформируются.' },
        ],
        rating: 5,
        reviews: 198
    },
    {
        id: 'bag-1',
        name: 'Груша боксерская профессиональная',
        category: 'boxing',
        price: 11000,
        oldPrice: 13900,
        discount: 25,
        image: 'assets/images/Груша.jpg',
        images: ['assets/images/Груша.jpg', 'assets/images/Лапы.jpg'],
        inStock: false,
        description: 'Профессиональная боксёрская груша для домашнего и клубного зала. Кожаная оболочка с двойным швом выдерживает интенсивные удары. Наполнитель — смесь ткани и песка — создаёт реалистичное ощущение при ударе. Цепное крепление в комплекте.',
        specs: [
            { label: 'Вес',        value: '45 кг' },
            { label: 'Высота',     value: '120 см' },
            { label: 'Диаметр',    value: '35 см' },
            { label: 'Оболочка',   value: 'Натуральная кожа' },
            { label: 'Наполнитель', value: 'Ткань + песок' },
            { label: 'Крепление',  value: 'Цепное, 4 точки' },
        ],
        rating: 4,
        reviews: 9
    },
    // ── ОДЕЖДА 
    {
        id: 'suit-1',
        name: 'Спортивный костюм Gussi Gang Classic',
        category: 'clothing',
        price: 9999,
        oldPrice: null,
        discount: 0,
        image: 'assets/images/sportik.jpg',
        images: ['assets/images/sportik.jpg'],
        inStock: true,
        description: 'Iconic спортивный костюм Gussi Gang Classic — культовая вещь для тех, кто ценит стиль и комфорт в равной мере. Мягкий хлопок с добавлением полиэстера обеспечивает воздухопроницаемость и форму после многократных стирок.',
        specs: [
            { label: 'Состав',    value: '80% хлопок, 20% полиэстер' },
            { label: 'Размеры',   value: 'XS / S / M / L / XL / 2XL / 3XL' },
            { label: 'Сезон',     value: 'Всесезонный' },
            { label: 'Уход',      value: 'Стирка до 40°C' },
            { label: 'Страна',    value: 'Россия' },
        ],
        reviewsList: [
            { author: 'Илья М.', rating: 5, date: '2026-01-08', text: 'Носил весь зимний сезон — не растягивается, цвет не выгорает. Ткань мягкая и дышащая.' },
            { author: 'Светлана П.', rating: 4, date: '2026-02-22', text: 'Хороший костюм, сидит отлично. Единственное — размер немного большемерит, берите на размер меньше.' },
        ],
        rating: 5,
        reviews: 65
    },
    {
        id: 'tshirt-1',
        name: 'Футболка тренировочная DriFit Pro',
        category: 'clothing',
        price: 2490,
        oldPrice: 3200,
        discount: 22,
        image: 'assets/images/sportik.jpg',
        images: ['assets/images/sportik.jpg'],
        inStock: true,
        description: 'Тренировочная футболка из ткани DriFit быстро выводит влагу и сохраняет тело сухим во время интенсивных нагрузок. Плоские швы не натирают кожу, свободный крой не сковывает движения.',
        specs: [
            { label: 'Ткань',   value: 'Полиэстер DriFit 100%' },
            { label: 'Вес',     value: '160 г/м²' },
            { label: 'Размеры', value: 'S / M / L / XL / XXL' },
            { label: 'Крой',    value: 'Свободный (regular fit)' },
            { label: 'Уход',    value: 'Стирка до 40°C, не гладить' },
        ],
        rating: 4,
        reviews: 41
    },
    {
        id: 'shorts-1',
        name: 'Шорты боксёрские сатиновые',
        category: 'clothing',
        price: 1850,
        oldPrice: 2400,
        discount: 23,
        image: 'assets/images/sportik.jpg',
        images: ['assets/images/sportik.jpg'],
        inStock: true,
        description: 'Классические боксёрские шорты из атласной ткани. Широкий эластичный пояс и разрезы по бокам обеспечивают свободу движений при ударах ногами и уклонах.',
        specs: [
            { label: 'Материал', value: 'Атлас 100%' },
            { label: 'Длина',    value: 'До колена' },
            { label: 'Размеры',  value: 'S / M / L / XL / XXL' },
            { label: 'Пояс',     value: 'Широкий эластичный' },
        ],
        rating: 4,
        reviews: 17
    },
    // ── ОБУВЬ 
    {
        id: 'sneakers-1',
        name: 'Кроссовки беговые SpeedRun X3',
        category: 'shoes',
        price: 7800,
        oldPrice: 9500,
        discount: 18,
        image: 'assets/images/боксерки.jpg',
        images: ['assets/images/боксерки.jpg'],
        inStock: true,
        description: 'Лёгкие беговые кроссовки SpeedRun X3 с дышащим сетчатым верхом и амортизирующей подошвой из пены EVA. Усиленная пятка обеспечивает стабилизацию при приземлении. Идеальны для бега по асфальту и беговой дорожке.',
        specs: [
            { label: 'Вес пары',  value: '240 г (р. 42)' },
            { label: 'Верх',      value: 'Сетка + накладки TPU' },
            { label: 'Подошва',   value: 'Пена EVA + резиновый протектор' },
            { label: 'Стелька',   value: 'Съёмная, ортопедическая' },
            { label: 'Размеры',   value: '36–47' },
        ],
        reviewsList: [
            { author: 'Никита Б.', rating: 5, date: '2026-01-30', text: 'Бегаю в них каждый день по 10 км. Подошва пружинит, нога не устаёт. Очень лёгкие.' },
            { author: 'Ольга Д.', rating: 5, date: '2026-03-05', text: 'Наконец нашла кроссовки которые не натирают. Носок широкий, дышат отлично.' },
        ],
        rating: 5,
        reviews: 54
    },
    {
        id: 'sneakers-2',
        name: 'Кроссовки зальные Asics Gel-Netburner',
        category: 'shoes',
        price: 6400,
        oldPrice: null,
        discount: 0,
        image: 'assets/images/боксерки.jpg',
        images: ['assets/images/боксерки.jpg'],
        inStock: true,
        description: 'Зальные кроссовки с фирменной гелевой амортизацией Asics GEL в пятке снижают ударную нагрузку при прыжках и резких стартах. Нескользящая подошва безопасна на любом покрытии зала.',
        specs: [
            { label: 'Амортизация', value: 'GEL-технология (пятка)' },
            { label: 'Верх',        value: 'Синтетика + сетка' },
            { label: 'Подошва',     value: 'Твёрдая резина AHAR' },
            { label: 'Размеры',     value: '36–48' },
            { label: 'Страна',      value: 'Япония / Вьетнам' },
        ],
        rating: 5,
        reviews: 33
    },
    // ── БЕГ 
    {
        id: 'run-1',
        name: 'Скакалка скоростная PVC Speed Rope',
        category: 'running',
        price: 490,
        oldPrice: 700,
        discount: 30,
        image: 'assets/images/Лапы.jpg',
        images: ['assets/images/Лапы.jpg'],
        inStock: true,
        description: 'Скоростная скакалка с алюминиевыми рукоятками и подшипниковым механизмом вращения. Трос регулируется по длине, подходит для людей ростом от 150 до 195 см. Идеальна для кроссфита, бокса и общей физической подготовки.',
        specs: [
            { label: 'Длина троса',  value: '3 м (регулируется)' },
            { label: 'Диаметр троса', value: '3 мм, ПВХ' },
            { label: 'Рукоятки',     value: 'Алюминий 16 см' },
            { label: 'Подшипник',    value: 'Шарикоподшипник 608ZZ' },
            { label: 'Вес',          value: '120 г' },
        ],
        rating: 4,
        reviews: 112
    },
    // ── АКСЕССУАРЫ 
    {
        id: 'bandage-1',
        name: 'Боксёрские бинты эластичные 4 м',
        category: 'accessories',
        price: 320,
        oldPrice: 450,
        discount: 29,
        image: 'assets/images/перчатки.jpg',
        images: ['assets/images/перчатки.jpg'],
        inStock: true,
        description: 'Эластичные боксёрские бинты для надёжной фиксации запястья и суставов пальцев. Петля для большого пальца и крючок-застёжка — намотка за 30 секунд. Выдерживают многократные стирки без потери эластичности.',
        specs: [
            { label: 'Длина',    value: '4 м' },
            { label: 'Ширина',   value: '5 см' },
            { label: 'Состав',   value: '73% хлопок, 27% эластан' },
            { label: 'Застёжка', value: 'Липучка велкро' },
        ],
        rating: 5,
        reviews: 230
    },
    {
        id: 'bottle-1',
        name: 'Спортивная бутылка SteelMax 750 мл',
        category: 'accessories',
        price: 890,
        oldPrice: 1200,
        discount: 26,
        image: 'assets/images/Лапы.jpg',
        images: ['assets/images/Лапы.jpg'],
        inStock: true,
        description: 'Термобутылка с двойными стальными стенками держит напитки холодными до 24 часов и горячими до 12 часов. Крышка с поворотным клапаном — пьёшь одной рукой. Корпус не скользит в руке даже в перчатках.',
        specs: [
            { label: 'Объём',     value: '750 мл' },
            { label: 'Материал',  value: 'Нержавеющая сталь 18/8' },
            { label: 'Изоляция',  value: 'Двойные вакуумные стенки' },
            { label: 'Холод',     value: 'До 24 часов' },
            { label: 'Тепло',     value: 'До 12 часов' },
            { label: 'Крышка',    value: 'Поворотный клапан, герметичная' },
        ],
        rating: 4,
        reviews: 78
    },
];

/** Вспомогательные функции */
const Products = {
    getAll: () => PRODUCTS,
    getById: (id) => PRODUCTS.find(p => p.id === id) || null,
    getByCategory: (cat) => cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat),
    getRelated: (id, limit = 4) => {
        const product = Products.getById(id);
        if (!product) return [];
        return PRODUCTS.filter(p => p.category === product.category && p.id !== id).slice(0, limit);
    },
    countByCategory: (cat) => PRODUCTS.filter(p => p.category === cat).length,
};

const CATEGORY_NAMES = {
    all:         'Все товары',
    boxing:      'Бокс',
    clothing:    'Одежда',
    shoes:       'Обувь',
    running:     'Бег',
    accessories: 'Аксессуары',
};