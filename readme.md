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

## Lets Build it
---

1. npm run build
2. look at the terminal output
   1. it will have a guide that specifies how your pages are rendered
   2. server-side | serve-side renders at runtime(uses getInitialProps or getServerSideProps)
   3. static - automatically rendred as static html
   4. SSG - autogen with static html + JSON uses getStaticProps
   5. ISR - incremental static regen (uses revalidate in getStaticProps)

3. if we run npm start not the npm dev we will server our .next pages files that are being prerendered and not our development directory

4. HYDRATION - PreRendered HTML code is connected with the React Application


## Using ISR
--

1. What is ISR?
   1. Using incremental static generation
      1. you don't just generate your page at build time
      2. continusily generates your page, on every request
      3. at most every X seconds
         1. Serve 'old' page if regeneration is not needed yet
         2. Generate, store and server 'new' page otherwise

2. revalidate
   1. if we add revalidate to have our props object insdie our getStaticProps
   2. we can append how many seconds at most we want to revalidate our data.
      1. ``revalidate: 60`` for example
      2. For highly dynamic content lower seconds is ideal 
      3. revalidate in dev will always regnerate immediately basically it does nothing; but production revalidate will fire as per your configuration.

3. Now if we run npm run build
   1. we can see ISR / 60 seconds
   2. npm start to start our build
   3. now if we visit our localhost and reload after our revalidate time
   4. we will get re-generating to show you that it runs again.

### getStaticProps & configuration options
---

1. if we pass context as an argument into getStaticProps we can have dynamic content.
2. inside our getStaticProps config, where we pass revalidate we can add
   1. notFound: boolean
      1. returns 404 if true, good for if data fetching fails or has 0 products

```
if (data.products.length === 0){
    return {
      notFound: true
    }
  }
```

   2. redirect: string
      1. lets you  redirect if there is no data at all.
   ```
     if (!data){
    return {
      redirect: 
      {
        destination: '/no-data'
      }
    }
  }
    ```

2. What is context?
    - This allows us to the concrete data from a dynamic segment path
    - lets destructure context into { params } so we can use that dynamic data
    - we used useRouter to tap into our component params in our previous moduel but this is explicitly for getStaticProps

3. Lets add our filepath, jsonData and data consts next, we can just copy from our index.js and add to our getStaticProps


[pid].js completed page

```
import { Fragment } from "react";

import fs from "fs/promises";
import path from "path";

function ProductDetailPage(props){
    
    const { loadedProduct } = props;
    return (
    <Fragment>
        <h1>{loadedProduct.title}</h1>
        <p>{loadedProduct.description}</p>
    </Fragment>
    );
}



export async function getStaticProps(context){
    const { params } = context;

    const productId = params.pid;
    const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);

    const product = data.products.find(product => product.id === productId);

    return {
        props: {
            loadedProduct: product
        }
    }
}



export default ProductDetailPage;
```

### getStaticPaths for Dynamic Pages
---

1. Dynamic Pages aren't pre-generated by default
2. When you add getStaticProps you tell next.js that you want to pre-render
3. But for a DYNAMIC page it makes a difference, because next js doesn't know how many pages you need
4. For Dynamic routes we need to give next.js more information
5. Dynamic pages dont just need data
    - they also need to know what [id] values will be available!

6. We can generate multiple dynamic pages use getStaticPaths() function

``export async function getStaticPaths(){}``
7.Can only be accessed by your page component files
8. must be exported


##. getStaticPaths How to use it
---

1. Lets solve our console error now
2. lets add our export async function getStaticPaths after our getStaticProps
3. we wil return an object
    - it has the key path with an array of objects as the value

## Compare your .next files

    - You will notice that our dynamic data pages are pre-rendereed p1, p2, p3!
    - you can see the fetch requests inside the console now

## Fallback
--

What is fallback?
    - boolean property
    - lets you be specific about if you want to load pages that aren't provided, p3 for example, not pre-generated though, only when a request is made. 
    - This lets you postpone pre-generation for only when their needed.

Lets try to view a page now that doesn't exist, say p4

1. we don't have a product w/ this page, so we get the 404.
2. 