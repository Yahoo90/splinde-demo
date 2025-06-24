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