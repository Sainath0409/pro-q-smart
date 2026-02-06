export const COLUMN_WIDTHS = {
    ITEM_CODE: 150,
    MATERIAL: 200,
    QUANTITY: 100,
    ESTIMATED_RATE: 150,
    SUPPLIER: 180,
    DEFAULT: 150
};

export const SUPPLIER_COLUMNS = [
    'Supplier 1 (Rate)',
    'Supplier 2 (Rate)',
    'Supplier 3 (Rate)',
    'Supplier 4 (Rate)',
    'Supplier 5 (Rate)'
];

export const BOM_COLUMNS = [
    'Item Code',
    'Material',
    'Quantity',
    'Estimated Rate',
    ...SUPPLIER_COLUMNS
];
