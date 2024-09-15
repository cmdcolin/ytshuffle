export default function Link({
  href,
  target,
  rel,
  children,
}: {
  href: string
  target?: string
  rel?: string
  children: React.ReactNode
}) {
  return (
    <a
      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
      target={target}
      rel={rel}
      href={href}
    >
      {children}
    </a>
  )
}
