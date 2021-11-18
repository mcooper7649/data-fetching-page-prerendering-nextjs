import { useEffect, useState } from "react";
import useSWR from "swr";

function LastSalesPage(props) {
    const [sales, setSales] = useState(props.sales);
  //   const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR(
    "https://next-js-course-9dc05-default-rtdb.firebaseio.com/sales.json"
  );

  useEffect(() => {
    if (data) {
      const transFormedSales = [];

      for (const key in data) {
        transFormedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transFormedSales);
    }
  }, []);

  //   useEffect(() => {
  //     setIsLoading(true);
  //     fetch("https://next-js-course-9dc05-default-rtdb.firebaseio.com/sales.json")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const transFormedSales = [];

  //         for (const key in data) {
  //           transFormedSales.push({
  //             id: key,
  //             username: data[key].username,
  //             volume: data[key].volume,
  //           });
  //         }

  //         setSales(transFormedSales);
  //         setIsLoading(false);
  //       });
  //   }, []);

  if (error) {
    return <p>Failed to load</p>;
  }

  if (!sales && !data) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  return fetch(
    "https://next-js-course-9dc05-default-rtdb.firebaseio.com/sales.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const transFormedSales = [];

      for (const key in data) {
        transFormedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      return {
        props: {
          sales: transFormedSales,
        },
      };
    });
}

export default LastSalesPage;
