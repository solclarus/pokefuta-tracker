/** 県境をまたぐ同名市区町村（例: 府中市）を区別するための複合キー */
export const cityKey = (pref: string, city: string) => `${pref}::${city}`;
