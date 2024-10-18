import { Button, Drawer, DrawerOverlay } from "@chakra-ui/react"
import { useState } from "react"

type IgnoreListDrawerProps = {
  ignoreList: string[]
  setIgnoreList: (list: string[]) => void
}

const IgnoreListDrawer = ({ ignoreList, setIgnoreList }: IgnoreListDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>除外リストを開く</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)} blockScrollOnMount={false}>
        <DrawerOverlay />
      </Drawer>
    </>
  )
}

export default IgnoreListDrawer
