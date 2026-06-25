export default function Spinner({ label }) {
  return (
    <div className="py-8">
      <div className="sweep fuse-track h-1 mb-4 max-w-xs">
        <div className="fuse-fill h-full w-1/3" style={{ background: '#74D3AE' }} />
      </div>
      <p className="text-sm text-dust">{label || 'Working on it…'}</p>
    </div>
  )
}
