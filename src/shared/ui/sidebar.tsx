
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'
import { Button } from '@/shared/ui/button'
import { useState } from 'react'

export const Sidebar=()=> {
  const [open , setOpen] = useState(true) 
  return (
    <Sheet open={open} modal={false}>
      <SheetTrigger asChild>
        <Button className='absolute top-0 left-0' onClick={()=>{setOpen(true)}} variant="outline" >{">"}</Button>
      </SheetTrigger>
      <SheetContent  onClose={()=>{setOpen(false)}} side='left'>
      
        <SheetHeader>
        <Button className='absolute top-0 -right-11' onClick={()=>{setOpen(false)}} variant="outline" >{open?"<":">"}</Button>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
       hi
        </div>
        <SheetFooter>
            <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

