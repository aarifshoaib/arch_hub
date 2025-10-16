import { z } from 'zod'

// Base validation schemas
const applicationIdSchema = z.string()
  .min(3, 'Application ID must be at least 3 characters')
  .max(20, 'Application ID must not exceed 20 characters')
  .regex(/^[A-Z]{2,4}[0-9]{3,6}$/, 'Application ID must start with 2-4 letters followed by 3-6 numbers')

const applicationNameSchema = z.string()
  .min(3, 'Application name must be at least 3 characters')
  .max(100, 'Application name must not exceed 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Application name must contain only lowercase letters, numbers, and hyphens')

const commonNameSchema = z.string()
  .min(5, 'Common name must be at least 5 characters')
  .max(200, 'Common name must not exceed 200 characters')

const prefixSchema = z.string()
  .min(2, 'Prefix must be at least 2 characters')
  .max(10, 'Prefix must not exceed 10 characters')
  .regex(/^[A-Z]{2,10}$/, 'Prefix must contain only uppercase letters')

const descriptionSchema = z.string()
  .max(1000, 'Description must not exceed 1000 characters')
  .optional()

const productNameSchema = z.string()
  .min(3, 'Product name must be at least 3 characters')
  .max(150, 'Product name must not exceed 150 characters')

const versionSchema = z.string()
  .min(1, 'Version is required')
  .max(50, 'Version must not exceed 50 characters')
  .regex(/^[vV]?[0-9]+(\.[0-9]+)*([a-zA-Z0-9-]*)?$/, 'Version must be a valid format (e.g., v4.2.1, 1.0.0)')

const integrationIdSchema = z.string()
  .regex(/^(INT_[A-Z0-9_]+|)$/, 'Integration ID must start with INT_ followed by uppercase letters, numbers, and underscores, or be empty')
  .optional()

const replacementIdSchema = z.string()
  .regex(/^(REP_[A-Z0-9_]+|)$/, 'Replacement ID must start with REP_ followed by uppercase letters, numbers, and underscores, or be empty')
  .optional()

// Enum schemas
const lifecycleStatusSchema = z.enum(['Production', 'Development', 'Testing', 'Deprecated'])
const tierSchema = z.enum(['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'])
const applicationTypeSchema = z.enum(['COTS', 'Custom', 'SaaS'])
const strategySchema = z.enum(['Maintain', 'Enhance', 'Modernize', 'Transform', 'Eliminate'])

// Deployment locations schema
const deploymentLocationsSchema = z.object({
  enbdUAE: z.boolean().optional(),
  ei: z.boolean().optional(),
  enbdKSA: z.boolean().optional(),
  enbdEgypt: z.boolean().optional(),
  enbdIndia: z.boolean().optional(),
  enbdLondon: z.boolean().optional(),
  enbdSingapore: z.boolean().optional()
})

// Strategy schema
const strategyObjectSchema = z.object({
  shortTerm: strategySchema,
  midTerm: strategySchema,
  longTerm: strategySchema
})

// Main application schema
export const applicationFormSchema = z.object({
  // Basic Information
  id: applicationIdSchema,
  applicationName: applicationNameSchema,
  applicationCommonName: commonNameSchema,
  prefix: prefixSchema,
  description: descriptionSchema,

  // Ownership & Architecture
  ownerDivision: z.string().min(1, 'Please select an owner division'),
  ownerDomain: z.string().min(1, 'Please select an owner domain'),
  architectureDomainL1: z.string().min(1, 'Please select Architecture Domain L1'),
  architectureDomainL2: z.string().min(1, 'Please select Architecture Domain L2'),
  architectureDomainL3: z.string().min(1, 'Please select Architecture Domain L3'),

  // Vendor & Product Information
  vendorName: z.string().min(1, 'Please select a vendor'),
  productName: productNameSchema,
  version: versionSchema,
  applicationType: applicationTypeSchema,

  // Lifecycle & Strategy
  lifecycleStatus: lifecycleStatusSchema,
  currentTier: tierSchema,
  targetTier: tierSchema,
  strategy: strategyObjectSchema,

  // Deployment Locations
  deploymentLocations: deploymentLocationsSchema,

  // Integration & Management
  externallyManagedService: z.boolean().optional(),
  integrationPointId: integrationIdSchema,
  applicationReplacementId: replacementIdSchema,

  // System Metadata
  is_active: z.boolean(),
  created_by: z.string().min(1, 'Created by is required'),
  created_on: z.string().min(1, 'Created date is required'),
  updated_by: z.string().min(1, 'Updated by is required'),
  updated_on: z.string().min(1, 'Updated date is required')
})

export type ApplicationFormData = z.infer<typeof applicationFormSchema>

// Field-specific validation schemas for dynamic validation
export const fieldValidationSchemas = {
  textbox: {
    required: (value: string, minLength?: number, maxLength?: number, pattern?: string) => {
      if (!value || value.trim() === '') {
        return 'This field is required'
      }
      if (minLength && value.length < minLength) {
        return `Minimum length is ${minLength} characters`
      }
      if (maxLength && value.length > maxLength) {
        return `Maximum length is ${maxLength} characters`
      }
      if (pattern) {
        const regex = new RegExp(pattern)
        if (!regex.test(value)) {
          return 'Invalid format'
        }
      }
      return null
    },
    optional: (value: string, maxLength?: number, pattern?: string) => {
      if (!value || value.trim() === '') {
        return null // Optional field, empty is valid
      }
      if (maxLength && value.length > maxLength) {
        return `Maximum length is ${maxLength} characters`
      }
      if (pattern) {
        const regex = new RegExp(pattern)
        if (!regex.test(value)) {
          return 'Invalid format'
        }
      }
      return null
    }
  },
  select: {
    required: (value: string) => {
      if (!value || value.trim() === '') {
        return 'Please select an option'
      }
      return null
    },
    optional: (value: string) => {
      return null // Select fields are always valid if optional
    }
  },
  checkbox: {
    required: (value: boolean) => {
      if (!value) {
        return 'This field must be checked'
      }
      return null
    },
    optional: (value: boolean) => {
      return null // Checkbox fields are always valid
    }
  },
  datetime: {
    required: (value: string) => {
      if (!value || value.trim() === '') {
        return 'Please select a date'
      }
      if (isNaN(Date.parse(value))) {
        return 'Invalid date format'
      }
      return null
    },
    optional: (value: string) => {
      if (!value || value.trim() === '') {
        return null // Optional field, empty is valid
      }
      if (isNaN(Date.parse(value))) {
        return 'Invalid date format'
      }
      return null
    }
  }
}
