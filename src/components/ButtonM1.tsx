import Button from './Button'

export default function ButtonM1({
  children,
  ...rest
}: {
  onClick?: () => void
  id?: string
  type?: 'reset' | 'submit' | 'button' | undefined
  className?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Button {...rest} className="m-0.5">
      {children}
    </Button>
  )
}
