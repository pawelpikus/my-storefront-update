import {
  useProductByIdQuery,
  ProductFilterByNameDocument,
  ProductFilterByNameQuery,
  Product,
} from "@/saleor/api";
import { apolloClient } from "@/lib";
import { Layout, ProductDetails } from "@/components";
import { GetStaticProps } from "next";

const styles = {
  columns: "grid grid-cols-2 gap-x-10 items-start",
  image: {
    aspect: "aspect-w-1 aspect-h-1 bg-white rounded",
    content: "object-center object-cover",
  },
  details: {
    title: "text-4xl font-bold tracking-tight text-gray-800",
    category: "text-lg mt-2 font-medium text-gray-500",
    description: "prose lg:prose-s",
  },
};

interface Props {
  id: string;
}

const ProductPage = ({ id }: Props) => {
  const { loading, error, data } = useProductByIdQuery({ variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const { product } = data;

    return (
      <Layout>
        <ProductDetails product={product as Product} />
      </Layout>
    );
  }

  return null;
};

export default ProductPage;

export async function getStaticPaths() {
  const { data } = await apolloClient.query<ProductFilterByNameQuery>({
    query: ProductFilterByNameDocument,
    variables: {
      filter: {},
    },
  });
  const paths = data.products?.edges.map(({ node: { id } }) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      id: params?.id,
    },
  };
};
