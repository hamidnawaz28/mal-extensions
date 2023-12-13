import {
  Box,
  Button,
  Input,
  Typography
} from '@mui/material'
import { useId, useState } from 'react'
import { addCartOrder } from '../../firebase/apis'

function ResponseContainer() {
  const [orderName, setOrderName] = useState("")
  const [token, setToken] = useState("")
  const [displayToken, setDisplayToken] = useState(false)
  const uuid = useId()

  const onGenerateHandle = () => {
    setToken(uuid)
    setDisplayToken(true)
  }

  const onSaveHandle = async () => {
    const cartData = getCartData()
    await addCartOrder({
      orderName,
      token,
      cartData
    })
  }

  return (
    <Box>
      <Typography >Name</Typography>
      <Input placeholder='' value={orderName} onChange={((e: any) => setOrderName(e.target.value))}></Input>
      <Button onClick={onGenerateHandle}>Generate</Button>
      {
        displayToken && <Input placeholder='' value={token}></Input>
      }
      <Button onClick={onSaveHandle}>Save</Button>
    </Box>
  )
}

export default ResponseContainer


const getCartData = () => Array.from(document.querySelectorAll("#cart-app .warehouse-group div[data-goods-id]")).map(el => {
  const attributes: any = el.attributes
  const itemsRef: any = el.querySelector("[name='item_qty']")
  const items = itemsRef.value
  return {
    sku: attributes["data-sku-id"].value,
    goodId: attributes["data-goods-id"].value,
    label: attributes["aria-label"].value,
    stock: attributes["data-attr-stock"].value,
    usPrice: attributes["data-us-price"].value,
    usOriginPrice: attributes["data-us-origin-price"].value,
    items
  }
})