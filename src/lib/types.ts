export type TreeNode = {
    name: string
}

export type Entry = TreeNode & {
    note: string
    sum: number
}

export type Section = TreeNode & {
    children: (Entry | Section)[]
}

export type ComputedSection = TreeNode & {
    children: (Entry | ComputedSection)[]
    computedSum: number
}

export type NodeAction = 
    | { type: 'add-entry'; path: number[] }
    | { type: 'add-section'; path: number[] }
    | { type: 'remove-node'; path: number[] }
    | { type: 'update'; path: number[]; field: 'sum' | 'note' | 'name'; value: string | number };