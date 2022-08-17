import {
  Product,
  useProductFilterByNameQuery,
  OrderDirection,
  ProductOrderField,
} from "@/saleor/api";
import { Pagination } from "./Pagination";
import { ProductElement } from "./ProductElement";

const styles = {
  grid: "grid gap-4 grid-cols-4",
};

export const ProductCollection = () => {
  const { loading, error, data, fetchMore } = useProductFilterByNameQuery({
    variables: {
      filter: { search: "t-shirt" },
      sortBy: {
        field: ProductOrderField.Name,
        direction: OrderDirection.Desc,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const products = data.products?.edges || [];
    const pageInfo = data.products?.pageInfo;
    const totalCount = data.products?.totalCount;

    const onLoadMore = () => {
      fetchMore({
        variables: {
          after: pageInfo?.endCursor,
        },
      });
    };

    return (
      <>
        <ul role="list" className={styles.grid}>
          {products?.length > 0 &&
            products.map(({ node }) => (
              <ProductElement key={node.id} {...(node as Product)} />
            ))}
        </ul>
        {pageInfo?.hasNextPage && (
          <Pagination
            onLoadMore={onLoadMore}
            itemCount={products.length}
            totalCount={totalCount || NaN}
          />
        )}
      </>
    );
  }

  return null;
};
