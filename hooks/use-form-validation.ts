import { useState, useCallback } from "react"
import { z } from "zod"

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>
  initialValues: Partial<T>
  onSubmit?: (data: T) => void | Promise<void>
}

interface FormState<T> {
  values: Partial<T>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

export function useFormValidation<T>({
  schema,
  initialValues,
  onSubmit
}: UseFormValidationOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false
  })

  const validateField = useCallback((name: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = schema.pick({ [name]: true } as any)
      fieldSchema.parse({ [name]: value })
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || "Invalid value"
      }
      return "Validation error"
    }
  }, [schema])

  const validateForm = useCallback(() => {
    try {
      schema.parse(state.values)
      return {}
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0].toString()] = err.message
          }
        })
        return errors
      }
      return { general: "Validation failed" }
    }
  }, [schema, state.values])

  const setValue = useCallback((name: string, value: any) => {
    setState(prev => {
      const newValues = { ...prev.values, [name]: value }
      const fieldError = validateField(name, value)
      const newErrors = { ...prev.errors }
      
      if (fieldError) {
        newErrors[name] = fieldError
      } else {
        delete newErrors[name]
      }

      // Check if form is valid
      try {
        schema.parse(newValues)
        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0
        }
      } catch {
        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          isValid: false
        }
      }
    })
  }, [validateField, schema])

  const setTouched = useCallback((name: string, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched }
    }))
  }, [])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!onSubmit) return

    setState(prev => ({ ...prev, isSubmitting: true }))

    try {
      const validatedData = schema.parse(state.values)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0].toString()] = err.message
          }
        })
        setState(prev => ({ ...prev, errors, isSubmitting: false }))
        return
      }
      console.error("Form submission error:", error)
    }

    setState(prev => ({ ...prev, isSubmitting: false }))
  }, [schema, state.values, onSubmit])

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false
    })
  }, [initialValues])

  const getFieldProps = useCallback((name: string) => ({
    value: state.values[name as keyof T] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(name, e.target.value)
    },
    onBlur: () => setTouched(name),
    error: state.touched[name] ? state.errors[name] : undefined
  }), [state.values, state.errors, state.touched, setValue, setTouched])

  const getSelectProps = useCallback((name: string) => ({
    value: state.values[name as keyof T] || "",
    onValueChange: (value: string) => {
      setValue(name, value)
      setTouched(name)
    },
    error: state.touched[name] ? state.errors[name] : undefined
  }), [state.values, state.errors, state.touched, setValue, setTouched])

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    setValue,
    setTouched,
    handleSubmit,
    reset,
    getFieldProps,
    getSelectProps,
    validateForm
  }
}
