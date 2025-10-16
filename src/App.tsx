import { Providers } from './app/providers'
import { AppRouter } from './app/routes'

function App() {
  console.log('App component rendering...')

  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
