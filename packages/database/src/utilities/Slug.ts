/* eslint-disable id-length */

/** A character map used to convert non Latin characters into Latin. */
export const TransliterationMap = {
    '3': 'Ξξ' as const,
    '8': 'Θθ' as const,
    A: 'ÀÁÂÃÄÅΑΆАĄĀ' as const,
    AE: 'Æ' as const,
    C: 'ÇЦČĆ' as const,
    E: 'ÈÉÊËΕΈЕЭĚĒ' as const,
    I: 'ÌÍÎÏΙΊΪİИІĪ' as const,
    D: 'ÐΔДĎ' as const,
    N: 'ÑΝНŇŃŅ' as const,
    O: 'ÒÔÕÖŐØΟΌОŌ' as const,
    o: 'Óòóôõöőøοόоō' as const,
    U: 'ÙÚÛÜŰУŮŪ' as const,
    Y: 'ÝΥΎΫЫ' as const,
    TH: 'Þ' as const,
    ss: 'ß' as const,
    a: 'àáâãäåαάаąā' as const,
    ae: 'æ' as const,
    c: 'çцčć' as const,
    e: 'èéêëεέеэěĘęē' as const,
    i: 'ìíîïιίϊΐıиіī' as const,
    d: 'ðδдď' as const,
    n: 'ñνнňńņ' as const,
    u: 'ùúûüűуůū' as const,
    y: 'ýÿυύΰϋы' as const,
    th: 'þ' as const,
    '(c)': '©' as const,
    B: 'ΒБ' as const,
    G: 'ΓĞГҐĢ' as const,
    Z: 'ΖЗŽŹŻ' as const,
    H: 'ΗΉХ' as const,
    K: 'ΚК' as const,
    L: 'ΛЛŁĻĽ' as const,
    M: 'ΜМ' as const,
    P: 'ΠП' as const,
    R: 'ΡРŘ' as const,
    S: 'ΣŞСŠŚ' as const,
    T: 'ΤТŤ' as const,
    F: 'ΦФ' as const,
    X: 'Χ' as const,
    PS: 'Ψ' as const,
    W: 'ΩΏ' as const,
    b: 'βб' as const,
    g: 'γğгґģ' as const,
    z: 'ζзžźż' as const,
    h: 'ηήх' as const,
    k: 'κкĶķ' as const,
    l: 'λлłļľ' as const,
    m: 'μм' as const,
    p: 'πп' as const,
    r: 'ρрř' as const,
    s: 'σςşсšś' as const,
    t: 'τтť' as const,
    f: 'φф' as const,
    x: 'χ' as const,
    ps: 'ψ' as const,
    w: 'ωώ' as const,
    V: 'В' as const,
    Yo: 'Ё' as const,
    Zh: 'Ж' as const,
    J: 'Й' as const,
    Ch: 'Ч' as const,
    Sh: 'ШЩ' as const,
    '': 'ЪЬъь' as const,
    Yu: 'Ю' as const,
    Ya: 'Я' as const,
    v: 'в' as const,
    yo: 'ё' as const,
    zh: 'ж' as const,
    j: 'й' as const,
    ch: 'ч' as const,
    sh: 'шщ' as const,
    yu: 'ю' as const,
    ya: 'я' as const,
    Ye: 'Є' as const,
    Yi: 'Ї' as const,
    ye: 'є' as const,
    yi: 'ї' as const,
};

export class Slug {
    /** Simple method of converting a string into a slug. */
    public static create(value: string) {
        return value
            .toLowerCase()
            .replaceAll(/[^\da-z-]/g, '-')
            .replaceAll(/-+/g, '-')
            .replaceAll(/^-|-$/g, '');
    }

    /** More advanced method of converting a string into a slug. */
    public static createWithTransliteration(value: string) {
        return value
            .toLowerCase()
            .replaceAll(/[^\da-z-]/g, match => {
                for (const [key, value] of Object.entries(TransliterationMap))
                    if (value.includes(match)) return key;
                return '-';
            })
            .replaceAll(/-+/g, '-')
            .replaceAll(/^-|-$/g, '');
    }
}