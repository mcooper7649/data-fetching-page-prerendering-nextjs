## NEXT JS Data Fetching and Page Pre-Rending
---
1. Next.js Uses SSR rending to call data
2. In a normal react site we wouldn't have content on our intial load of hte page that was fetched due to the way call requests the data and time to receive it


### Static Generation
---

Pre-Generate the page during build time

Pages are prepared ahead to time and can be cached by the server
    - its cached by the server/cdn


- How do we tell nextjs to static generated page?
  - ``export async function getStaticProps(){}
      ``

- getStatic props is ran before our component function
- it will return an object with props:
```
return {
    props: {
      productExample: [
        {
          id: "p1",
          title: "Product 1",
        },
      ],
    },
  };
```
- we will pull 'productExmample' from our getStaticProps props;
- we can then use object destructuring to tap into these props
-   const { productExample } = props;
- we can dynamically access and list with mapping 


## import the fs/promises
---

1. adding the fs will allow us to tap into the local filesystem with the fs package.
2. it won't be visible from the client side, like getStaticProps.
3.  fs.readFileSync()
4.  if you add fs/promises to the import we can the utilize the promises aspect
5.  this allows us to use await on our fs.readFileSynce
6.  next lets import path from 'path'
7.  then we can path.join and tap into process.cwd //remember this will be project root and noth path
8.  when we build our fielPath we are going to specify each segment,
    1.  process.cwd //root
    2.  'data' //subfolder
    3.  dummy-backend.json // actual file

9. now we can create a const data = JSON.parse(jsonData)
   ```
import fs from "fs/promises";
import path from "path";

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return {
    props: {
      products: data.products
    },
  };
}

export default HomePage;
```