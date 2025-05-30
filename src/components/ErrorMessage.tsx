export default function ErrorMessage({ error }: { error: unknown }) {
  return (
    <div className="m-10">
      <span className="text-red-500 bg-red-50 p-3 rounded-md border border-red-200">{`${error}`}</span>
    </div>
  )
}
