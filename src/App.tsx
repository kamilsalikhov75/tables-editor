import { Sidebar } from '@/shared/ui/sidebar'
import {EditorHeader} from '@/widgets/header'
import { Container } from '@/features/editor/ui/container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
function App() {
  return (
    <>
    <EditorHeader />
    <Sidebar/>
    <DndProvider backend={HTML5Backend}><Container/>
    </DndProvider>
    
    </>
      
  )
}

export default App
