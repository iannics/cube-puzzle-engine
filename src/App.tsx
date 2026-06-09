import { useMemo } from 'react'
import { createSolvedCube } from './domain'
import { CubeScene } from './render'

function App() {
  const cube = useMemo(() => createSolvedCube(3), [])

  return <CubeScene state={cube} />
}

export default App
