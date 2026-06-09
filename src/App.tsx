import { CubeScene } from './render'
import { useCubeKeyboard } from './ui'

function App() {
  useCubeKeyboard()

  return <CubeScene />
}

export default App
