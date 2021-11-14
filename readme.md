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
  - ``export async function getStaticProps(context){
  }
      ``