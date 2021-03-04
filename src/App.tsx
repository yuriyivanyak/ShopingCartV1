import {useState} from 'react'
import {useQuery} from 'react-query'
//components
import Item from './item/Item'
import Cart from './Cart/Cart'
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'
//styled
import {Wrapper, StyledButton} from './App.styles'
//types
 export type CartItemType = {
   id: number
   category: string
   description: string
   image: string
   price: number
   title: string
   amount: number
 }

const getProduct = async (): Promise<CartItemType[]> => 
  await( await fetch('https://fakestoreapi.com/products')).json();


const App = () => {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const {data, isLoading, error} = useQuery<CartItemType[]>('products', getProduct);

  console.log(data)

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ak: number, item) => ak + item.amount, 0);
  

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemIn = prev.find(item => item.id === clickedItem.id)

      if (isItemIn) {
        return prev.map(item => 
          item.id === clickedItem.id
          ? {...item, amount: item.amount + 1}
          : item 
        );
      }
      
      return [...prev, {...clickedItem, amount: 1}];

    });
  };

  const handleRemoveFromCard = (id: number) => {
    setCartItems(prev =>
      prev.reduce((acc, item) => {
        if(item.id === id) {
          if(item.amount=== 1) return acc;
          return [...acc, {...item, amount: item.amount - 1}];
        }else {
          return [...acc, item];
        }
      }, [] as CartItemType [])
    );
  }; 
  

  if(isLoading) return <LinearProgress/>
  if(error) return <div>Error dude!</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={()=>setCartOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCard}
        />
      </Drawer>
      <StyledButton onClick={()=> setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>  
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart}/>
            </Grid>
        )  )}
      </Grid>
    </Wrapper>
  );
}

export default App;
