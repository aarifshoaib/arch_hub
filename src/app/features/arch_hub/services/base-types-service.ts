import baseTypesData from '../data/base_types.json'

export interface BaseType {
  id: string
  base_type: string
  base_value: string
  parent: string | null
  parent_name: string | null
  is_active: boolean
  created_by: string
  created_on: string
  updated_by: string
  updated_on: string
}

export interface SelectOption {
  value: string
  label: string
}

export class BaseTypesService {
  static getAllBaseTypes(): BaseType[] {
    return baseTypesData.base_types
  }

  static getBaseTypesByType(baseType: string): BaseType[] {
    return baseTypesData.base_types.filter(item => item.base_type === baseType)
  }

  static getSelectOptions(baseType: string): SelectOption[] {
    const items = this.getBaseTypesByType(baseType)
    return items.map(item => ({
      value: item.base_value,
      label: item.base_value
    }))
  }

  static getSelectOptionsByParent(baseType: string, _parentField: string, parentValue: string): SelectOption[] {
    const items = this.getBaseTypesByType(baseType)
    const filteredItems = items.filter(item => item.parent_name === parentValue)
    
    return filteredItems.map(item => ({
      value: item.base_value,
      label: item.base_value
    }))
  }

  static getSelectOptionsWithParent(baseType: string, parentValue?: string): SelectOption[] {
    let items = this.getBaseTypesByType(baseType)
    
    if (parentValue) {
      items = items.filter(item => item.parent_name === parentValue)
    }
    
    return items.map(item => ({
      value: item.base_value,
      label: item.base_value
    }))
  }

  static getBaseTypeById(id: string): BaseType | undefined {
    return baseTypesData.base_types.find(item => item.id === id)
  }

  static getBaseTypeByValue(baseType: string, value: string): BaseType | undefined {
    return baseTypesData.base_types.find(item => 
      item.base_type === baseType && item.base_value === value
    )
  }

  static getAvailableBaseTypes(): string[] {
    const types = new Set(baseTypesData.base_types.map(item => item.base_type))
    return Array.from(types)
  }
}
