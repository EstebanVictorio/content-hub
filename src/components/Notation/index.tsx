'use client'
import { useField, useFormFields } from '@payloadcms/ui'
import { UIFieldClientComponent } from 'payload'
import { useEffect, useState } from 'react'
import { RoughNotation } from 'react-rough-notation'

type Props = {
  selector: Parameters<typeof useFormFields>[0]
  className?: string
} & Omit<
  React.ComponentProps<typeof RoughNotation>,
  'children' | 'type' | 'show' | 'color' | 'strokeWidth' | 'padding' | 'iterations'
>

type NotationType = React.ComponentProps<typeof RoughNotation>['type']
let timeout: NodeJS.Timeout
export const Notation: UIFieldClientComponent = ({ field }) => {
  const [render, setRender] = useState(true)
  const selectedField = useFormFields(([fields]) => fields[field.admin.custom?.name])
  if (!selectedField) return <span>Unavailable data from field {field.admin.custom?.name}</span>
  const { value: notationType } = useFormFields(([fields]) => fields.type) as {
    value: NotationType
  }
  const { value } = selectedField as { value: string }

  useEffect(() => {
    // @ts-ignore
    clearTimeout(timeout)
    setRender(false)
    timeout = setTimeout(() => {
      setRender(true)
    }, 1500)
  }, [value, notationType])

  if (!render)
    return (
      <span style={{ display: 'block', marginTop: '1.25rem', marginBottom: '0.25rem' }}>
        Loading notation...
      </span>
    )

  return (
    <label>
      <span style={{ display: 'block', marginTop: '1.25rem', marginBottom: '0.25rem' }}>
        Renders as:
      </span>
      <RoughNotation
        animate
        type={notationType}
        show
        color="#F59E0B"
        strokeWidth={2}

        padding={5}
        iterations={1}
      >
        {value}
      </RoughNotation>
    </label>
  )
}

export const Label: UIFieldClientComponent = ({ field }) => {
  const selectedField = useFormFields(([fields]) => fields[field.admin.custom?.name])
  if (!selectedField) return <span>Unavailable data from field {field.admin.custom?.name}</span>
  const { value } = selectedField as { value: string }

  return <div style={{ marginTop: '1rem' }}>{value}</div>
}
