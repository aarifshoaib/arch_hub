export interface FieldValidation {
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  customMessage?: string
}

export interface DataFilter {
  base_type?: string
  dependsOn?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface BaseField {
  sequence: number
  type: string
  title: string
  field: string
  isRequired: boolean
  columnSize: number
  validation: FieldValidation
}

export interface ListField extends BaseField {
  isList: boolean
  listType: string
  isPrimary?: boolean
  heading?: string
}

export interface TextField extends ListField {
  type: 'textbox'
  placeholder?: string
  multiline?: boolean
  rows?: number
  readonly?: boolean
  defaultValue?: string
  isTitle?: boolean
  link?: boolean
  route?: string
  linkValues?: string[]
}

export interface SelectField extends ListField {
  type: 'select'
  isSearchable: boolean
  dataSource?: string
  dataFilter?: DataFilter
  data?: SelectOption[]
  isSubTitle?: boolean
}

export interface CheckboxField extends Omit<BaseField, 'columnSize'> {
  type: 'checkbox'
  columnSize: number
  defaultValue?: boolean
  isList?: boolean
  listType?: string
  heading?: string
}

export interface DateTimeField extends BaseField {
  type: 'datetime'
  defaultValue?: string
  readonly?: boolean
}

export type FormField = TextField | SelectField | CheckboxField | DateTimeField

export interface FormSection {
  title: string
  id: string
  icon: string
  type: string
  description?: string
  fields: FormField[]
}

export interface FormMetadata {
  name: string
  version: number
  listRoute: string
  gridRoute: string
  formRoute: string
  addButtonName: string
  sections: FormSection[]
}
