"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/data/categories/categories.types"

interface CategoryNode {
  id: string
  name: string
  slug: string
  parentId: string | null
  level: number
  children: CategoryNode[]
}

interface CategoryTreeProps {
  categories: Category[]
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
}

export function CategoryTree({ categories, selectedIds, onSelectionChange }: CategoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build hierarchical tree
  const categoryTree = useMemo(() => {
    const categoryMap = new Map<string, CategoryNode>()
    const rootNodes: CategoryNode[] = []

    // Create nodes for all categories
    categories.forEach(category => {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        level: 0,
        children: []
      })
    })

    // Construir hierarquia
    categories.forEach(category => {
      const node = categoryMap.get(category.id)!
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(node)
          node.level = parent.level + 1
        }
      } else {
        rootNodes.push(node)
      }
    })

    return rootNodes
  }, [categories])

  // Initialize expanded nodes with root level items
  useEffect(() => {
    const rootIds = categoryTree.map(node => node.id)
    setExpandedNodes(new Set(rootIds))
  }, [categoryTree])

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds)
    
    if (checked) {
      // Add category and all its subcategories
      addCategoryAndChildren(categoryId, categoryTree, newSelectedIds)
    } else {
      // Remove category and all its subcategories
      removeCategoryAndChildren(categoryId, categoryTree, newSelectedIds)
    }
    
    const finalSelectedIds = Array.from(newSelectedIds)
    onSelectionChange(finalSelectedIds)
  }

  const addCategoryAndChildren = (categoryId: string, nodes: CategoryNode[], selectedIds: Set<string>) => {
    for (const node of nodes) {
      if (node.id === categoryId) {
        selectedIds.add(node.id)
        for (const child of node.children) {
          addCategoryAndChildren(child.id, [child], selectedIds)
        }
        break
      }
      if (node.children.length > 0) {
        addCategoryAndChildren(categoryId, node.children, selectedIds)
      }
    }
  }

  const removeCategoryAndChildren = (categoryId: string, nodes: CategoryNode[], selectedIds: Set<string>) => {
    for (const node of nodes) {
      if (node.id === categoryId) {
        selectedIds.delete(node.id)
        for (const child of node.children) {
          removeCategoryAndChildren(child.id, [child], selectedIds)
        }
        break
      }
      if (node.children.length > 0) {
        removeCategoryAndChildren(categoryId, node.children, selectedIds)
      }
    }
  }

  const renderNode = (node: CategoryNode) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedIds.includes(node.id)
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id} className="w-full">
        <div 
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.id)
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => handleCategoryToggle(node.id, !!checked)}
            className="mr-2"
            onClick={(e) => e.stopPropagation()}
          />
          
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {categoryTree.map(node => renderNode(node))}
    </div>
  )
} 