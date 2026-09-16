export const KEYS = {
  DRIVER: 'td_driver_name',
  TRANSACTIONS: 'td_transactions',
  LAST_NUMBER: 'td_last_transaction_number',
  REGIONS: 'td_regions',
  SETTINGS: 'td_settings',
  RECEIPT_TEMPLATE: 'td_receipt_template'
};

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadString(key, fallback = '') {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

export function saveString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    /* noop */
  }
}
