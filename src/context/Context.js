import { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer, productReducer } from "./Reducers";
import { useFaker } from "react-fakers";

const Cart = createContext();

const Context = ({ children }) => {
  // const products = [...Array(20)].map(() => ({
  //   id: faker.datatype.uuid(),
  //   name: faker.commerce.productName(),
  //   price: faker.commerce.price(),
  //   image: faker.random.image(),
  //   inStock: faker.random.arrayElement([0, 3, 5, 6, 7]),
  //   fastDelivery: faker.datatype.boolean(),
  //   ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  // }));

  const { success, error, loading } = useFaker({
    type: "products",
    params: { products: { quantity: 20 } },
  });

  const products = [];

  // useEffect(() => {
  //   if (success) {
  //     dispatch({
  //       type: "UPDATE_PRODUCTS",
  //       value: success.map((product, index) => {
  //         const isInStock =
  //           index === 0 || index === 3 || index === 5 || index === 12;
  //         const hasFastDelivery = index === 4 || index === 8 || index === 15;
  //         const ratings = 5;
  //         return {
  //           id: product.id,
  //           name: product.name,
  //           price: product.price,
  //           image: product.images[0].url,
  //           inStock: !isInStock,
  //           fastDelivery: hasFastDelivery,
  //           ratings: ratings,
  //         };
  //       }),
  //     });
  //   }
  // }, [success]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(
        "https://fakestoreapi.com/products?limit=20"
      );
      const data = await response.json();
      dispatch({
        type: "UPDATE_PRODUCTS",
        value: data.map((product, index) => {
          const isInStock =
            index === 0 || index === 3 || index === 5 || index === 12;
          const hasFastDelivery = index === 4 || index === 8 || index === 15;
          const ratings = 5;
          return {
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.image,
            inStock: !isInStock,
            fastDelivery: hasFastDelivery,
            ratings: ratings,
          };
        }),
      });
    }
    fetchProducts();
  }, []);

  const [state, dispatch] = useReducer(cartReducer, {
    products: products,
    cart: [],
  });

  const [productState, productDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  // console.log(productState);

  return (
    <Cart.Provider value={{ state, dispatch, productState, productDispatch }}>
      {children}
    </Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};

export default Context;
