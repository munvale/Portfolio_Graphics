import AshleyPersona from './components/AshleyPersona'

/**
 * Dev harness only. The graphic is transparent and has no spacing of its own;
 * this just gives it a column to sit in, the way a host section would.
 */
export default function App() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 16px' }}>
      <AshleyPersona />
    </main>
  )
}
