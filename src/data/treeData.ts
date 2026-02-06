export interface TreeItem {
    id: string;
    name: string;
    type: 'category' | 'subcategory' | 'item';
    description?: string;
    quantity?: number;
    rate?: number;
    children?: TreeItem[];
}

export const sampleTreeData: TreeItem[] = [
    {
        id: 'C1',
        name: 'Aerospace Parts',
        type: 'category',
        children: [
            {
                id: 'SC1-1',
                name: 'Structural Support',
                type: 'subcategory',
                children: [
                    {
                        id: 'SC2-1',
                        name: 'strut for seat mounting',
                        type: 'subcategory',
                        children: [
                            {
                                id: 'ITEM-1234',
                                name: 'ITEM-1234',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 20,
                                rate: 40.00
                            },
                            {
                                id: 'ITEM-1235',
                                name: 'ITEM-1235',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 10,
                                rate: 20.00
                            }
                        ]
                    }
                ]
            },
            {
                id: 'SC1-2',
                name: 'Brackets',
                type: 'subcategory',
                children: [
                    {
                        id: 'SC2-2',
                        name: 'Support strut for seat mounting',
                        type: 'subcategory',
                        children: [
                            {
                                id: 'ITEM-1236',
                                name: 'ITEM-1236',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 30,
                                rate: 10.00
                            },
                            {
                                id: 'ITEM-1237',
                                name: 'ITEM-1237',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 40,
                                rate: 70.00
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'C2',
        name: 'Precision Components',
        type: 'category',
        children: [
            {
                id: 'SC1-3',
                name: 'Fasteners',
                type: 'subcategory',
                children: [
                    {
                        id: 'SC2-3',
                        name: 'Titanium aerospace bolt',
                        type: 'subcategory',
                        children: [
                            {
                                id: 'ITEM-2122',
                                name: 'ITEM-2122',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 30,
                                rate: 50.00
                            },
                            {
                                id: 'ITEM-2123',
                                name: 'ITEM-2123',
                                description: 'Aerospace parts flying',
                                type: 'item',
                                quantity: 40,
                                rate: 21.00
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
