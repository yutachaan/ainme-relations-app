import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Input, ListItem, UnorderedList, Text } from "@chakra-ui/react"
import { useState } from "react"

type IgnoreListDrawerProps = {
  ignoreList: string[]
  setIgnoreList: (list: string[]) => void
}

const IgnoreListDrawer = ({ ignoreList, setIgnoreList }: IgnoreListDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')

  const handleAddKeyword = () => {
    if (keyword && !ignoreList.includes(keyword)) {
      setIgnoreList([...ignoreList, keyword])
      setKeyword('')
    }
  }

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setIgnoreList(ignoreList.filter(k => k !== keywordToDelete))
  }

  const handleReset = () => {
    setIgnoreList([])
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>除外リストを開く</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)} blockScrollOnMount={false}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>除外リスト</DrawerHeader>
          <DrawerBody>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleAddKeyword()
            }}>
              <Flex justifyContent="space-between" justify="center" mt="4">
                <Input
                  value={keyword}
                  placeholder="キーワードを入力"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Button onClick={handleAddKeyword} ml="2" colorScheme="teal">追加</Button>
              </Flex>
            </form>
            <UnorderedList mt="4" spacing="2" ml="0px">
              {ignoreList.map(keyword => (
                <ListItem key={keyword} listStyleType={"none"}>
                  <Flex justifyContent="space-between" align="center">
                    <Text fontSize="sm">{keyword}</Text>
                    <Button
                      onClick={() => handleDeleteKeyword(keyword)}
                      ml="2"
                      size="xs"
                      colorScheme="red"
                    >
                      削除
                    </Button>
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr="3" onClick={handleReset} colorScheme="red">リセット</Button>
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default IgnoreListDrawer
