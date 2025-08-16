import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'
import { useFormValidation } from '@/hooks/use-form-validation'

const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old')
})

type TestFormData = z.infer<typeof testSchema>

describe('useFormValidation', () => {
  it('should initialize with default values', () => {
    const initialValues = { name: '', email: '', age: 0 }
    
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues
      })
    )

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isValid).toBe(false)
  })

  it('should update values and validate fields', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: '', email: '', age: 0 }
      })
    )

    act(() => {
      result.current.setValue('name', 'John')
    })

    expect(result.current.values.name).toBe('John')
  })

  it('should validate field and show errors', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: '', email: '', age: 0 }
      })
    )

    act(() => {
      result.current.setValue('name', 'A') // Too short
    })

    expect(result.current.errors.name).toBe('Name must be at least 2 characters')
  })

  it('should clear errors when field becomes valid', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: '', email: '', age: 0 }
      })
    )

    // Set invalid value
    act(() => {
      result.current.setValue('name', 'A')
    })

    expect(result.current.errors.name).toBeDefined()

    // Set valid value
    act(() => {
      result.current.setValue('name', 'John')
    })

    expect(result.current.errors.name).toBeUndefined()
  })

  it('should handle form submission with valid data', async () => {
    const mockOnSubmit = jest.fn()
    const validData = { name: 'John', email: 'john@example.com', age: 25 }

    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: validData,
        onSubmit: mockOnSubmit
      })
    )

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockOnSubmit).toHaveBeenCalledWith(validData)
  })

  it('should not submit with invalid data', async () => {
    const mockOnSubmit = jest.fn()
    const invalidData = { name: 'A', email: 'invalid', age: 16 }

    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: invalidData,
        onSubmit: mockOnSubmit
      })
    )

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(Object.keys(result.current.errors)).toHaveLength(3)
  })

  it('should provide field props for input components', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: 'John', email: '', age: 0 }
      })
    )

    const fieldProps = result.current.getFieldProps('name')
    
    expect(fieldProps.value).toBe('John')
    expect(typeof fieldProps.onChange).toBe('function')
    expect(typeof fieldProps.onBlur).toBe('function')
  })

  it('should provide select props for select components', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: 'John', email: '', age: 0 }
      })
    )

    const selectProps = result.current.getSelectProps('name')
    
    expect(selectProps.value).toBe('John')
    expect(typeof selectProps.onValueChange).toBe('function')
  })

  it('should reset form to initial values', () => {
    const initialValues = { name: '', email: '', age: 0 }
    
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues
      })
    )

    // Change values
    act(() => {
      result.current.setValue('name', 'John')
      result.current.setValue('email', 'john@example.com')
    })

    expect(result.current.values.name).toBe('John')

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })

  it('should handle touched state', () => {
    const { result } = renderHook(() =>
      useFormValidation<TestFormData>({
        schema: testSchema,
        initialValues: { name: '', email: '', age: 0 }
      })
    )

    act(() => {
      result.current.setTouched('name', true)
    })

    expect(result.current.touched.name).toBe(true)
  })
})
